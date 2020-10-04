import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import "./user.scss";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        let res = await userApi.getUserInfo();
        console.log("user: ", res);
        setUser(res.user);
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, []);

  // let user = useSelector((state) => state.auth);

  const handleChangePassword = (e) => {
    e.preventDefault();
    let { password, passwordConfirm } = e.target;
    console.log("e", password.value, passwordConfirm.value);

    if (!password.value.trim()) {
      alert("no password filled out");
      return;
    }

    if (password.value.trim() !== passwordConfirm.value.trim()) {
      alert("Confirmed password doesn't match");
      return;
    }

    if (password.value.length < 6 || password.value.length > 20) {
      alert("Password length must be between 6-20 characters");
      return;
    }
    try {
      let res = userApi.changePass({ newPassword: password.value });
      console.log(res);
      alert("Change Password Successfully");
    } catch (error) {
      alert("Fail in Changing Pasword :((");
      console.log(error);
    }
  };

  return (
    user && (
      <>
        <div className="user">
          <div className="user__info">
            <span>ID: </span>
            <span>{user._id}</span>
          </div>
          <div className="user__info">
            <span>Email: </span> <span>{user.email}</span>
          </div>
          <div className="user__info">
            <span>Username:</span> <span>{user.name}</span>
          </div>
          <div className="user__info">
            <span>Cash: </span> <span>{user.cash}</span>
          </div>
        </div>
        <div className="form">
          <form onSubmit={handleChangePassword}>
            <h1>Change Password</h1>
            <div className="form__input">
              <input
                name="password"
                type="password"
                id="changePass"
                placeholder="New Password"
              />
              <span class="form__input--focus"></span>
            </div>
            <div className="form__input">
              <input
                name="passwordConfirm"
                type="password"
                placeholder="Confirm new password"
              />
              <span class="form__input--focus"></span>
            </div>
            <input type="submit" value="Confirm Changing" />
          </form>
        </div>
      </>
    )
  );
}

export default UserInfo;
