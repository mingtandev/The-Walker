const initialState = {
  users: [],
  status: "",
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USERS_LOADED":
      return {
        ...state,
        status: "",

        users: action.payload,
      };
    case "USERS_DELETE":
      let newUsers = [...state.users];
      let deleteID = action.payload;
      newUsers = newUsers.filter(function (item) {
        return item._id !== deleteID;
      });
      console.log("new", newUsers);
      return {
        ...state,
        status: "deleted",
        users: newUsers,
      };
    default:
      return { ...state };
  }
};

export default usersReducer;
