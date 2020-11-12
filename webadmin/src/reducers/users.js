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
      let deleteIDs = action.payload;
      console.log("object", deleteIDs);
      console.log("old", newUsers);
      newUsers = newUsers.filter(function (item) {
        return !deleteIDs.includes(item._id);
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
