import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import userApi from "../api/userApi";

function UserInfo() {
  const [user, setUser] = useState({});
  let history = useHistory();

  useEffect(() => {
    async function getUserInfo() {
      try {
        let res = await userApi.getUserInfo();
        console.log(res);
        setUser(res.user);
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();

    let { password } = e.target;
    console.log("e", password.value);
    try {
      let res = userApi.changePass(password.value);
      console.log(res);
      history.push("/user");
    } catch (error) {
      console.log(error);
      history.push("/user");
    }
  };

  return (
    user && (
      <div>
        <p>ID: {user._id}</p>
        <p>Email: {user.email}</p>
        <p>Username: {user.name}</p>
        <p>Cash: {user.cash}</p>
        <form onSubmit={handleChangePassword}>
          <label for="changePass">Change password</label>
          <input name="password" id="changePass" placeholder="New Password" />
        </form>
      </div>
    )
  );
}

export default UserInfo;
