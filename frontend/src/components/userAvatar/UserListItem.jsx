const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="mb-2 flex w-full cursor-pointer items-center rounded-lg bg-[#E8E8E8] px-3 py-2 text-black transition hover:bg-[#38B2AC] hover:text-white"
    >
      <img
        src={user.pic}
        alt={user.name}
        className="mr-2 h-8 w-8 cursor-pointer rounded-full object-cover"
      />

      <div>
        <p className="text-sm">
          {user.name}
        </p>

        <p className="text-xs">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;