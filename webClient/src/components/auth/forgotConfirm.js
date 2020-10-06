import React from "react";
import { Link, useHistory } from "react-router-dom";
import userApi from "../../api/userApi";
import "./form.scss";

function ForgotRecovery() {
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    let { password, token } = e.target;
    password = password.value;
    token = token.value;

    userApi
      .forgotConfirm({ newPassword: password, passwordResetToken: token })
      .then((res) => {
        alert("Change password successfully");
        console.log(res);
        history.push("/sign-in");
      })
      .catch((error) => {
        console.log(error);
        alert("Error in Confirming Your Reset Password");
        history.push("/forgot");
      });
  };

  return (
    <div className="form forgetform">
      <Link className="forgetform__login" to="/sign-in">
        Back to login
      </Link>
      <Link className="forgetform__register" to="/sign-up">
        Register
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="form__input">
          <input
            type="password"
            name="password"
            placeholder="Your Password..."
          />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input
            type="text"
            name="token"
            placeholder="Password Reset Token..."
          />
          <span class="form__input--focus"></span>
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default ForgotRecovery;
