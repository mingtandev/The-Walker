import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import userApi from "../../api/userApi";

function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        let res = await userApi.get();
        console.log(res);
        setUsers(res.users);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers();
  }, []);
  //   if (!localStorage.getItem("token")) return <Redirect to="/" />;

  const deleteUser = async (id) => {
    try {
      console.log(id);
      let res = await userApi.delete({ _id: id });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <ul>
        {users &&
          users.map((user) => (
            <li key={user._id}>
              <div>{user.name}</div>
              <button onClick={() => deleteUser(user._id)}>Delete User</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Users;
