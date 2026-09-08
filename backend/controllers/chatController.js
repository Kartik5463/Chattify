import Chat from "../models/Chat.js";
import User from "../models/User.js";
export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User id not sent");
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: {
            $elemMatch: {
              $eq: req.user._id,
            },
          },
        },
        {
          users: {
            $elemMatch: {
              $eq: userId,
            },
          },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    // Chat already exists
    if (isChat.length > 0) {
      res.status(200).json(isChat[0]);
    } else {
      // Create new chat
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error("Access Chat Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if(users.length < 2) {
    return res.status(400).send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}
export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only group admin can rename the group",
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const addToGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    if (!userId || !chatId) {
      throw new Error("Give proper fields to add");
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new Error("Chat not found");
    }

    if (!chat.isGroupChat) {
      throw new Error("Given chat is not a group");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: {
          users: userId
        }
      },
      {
        new: true
      }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const removeFromGroup =async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }
    if (chat.groupAdmin.toString() !== req.user._id.toString()&&userId.toString()!==req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only group admin can remove from the group",
      });
    }
  
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    res.json(removed);
};
