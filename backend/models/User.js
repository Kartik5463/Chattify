import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://static.vecteezy.com/system/resources/previews/060/605/418/non_2x/default-avatar-profile-icon-social-media-user-free-vector.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User