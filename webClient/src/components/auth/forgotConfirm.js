import React from "react";
import { Link, useHistory } from "react-router-dom";
import userApi from "../../api/userApi";
import "./form.scss";

function ForgotRecovery() {
  let history = useHistory();

  const togglePassword = (e) => {
    e.preventDefault();

    let password = document.querySelector(".password");
    let passwordEye = document.getElementById("togglePassword");
    password.type === "password"
      ? (password.type = "text")
      : (password.type = "password");
    passwordEye.classList.toggle("fa-eye-slash");
  };

  const togglePasswordReset = (e) => {
    e.preventDefault();

    let passwordReset = document.querySelector(".passwordReset");
    let passwordEye = document.getElementById("togglePasswordReset");
    passwordReset.type === "password"
      ? (passwordReset.type = "text")
      : (passwordReset.type = "password");
    passwordEye.classList.toggle("fa-eye-slash");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let { password, token } = e.target;
    password = password.value;
    token = token.value;

    if (password.trim().length < 6 || password.trim().length > 20) {
      alert("Password length must be 6-20 characters");
      return;
    }

    userApi
      .forgotConfirm({ newPassword: password, passwordResetToken: token })
      .then((res) => {
        if (res.msg !== "success") return;
        alert("Change password successfully");
        console.log(res);
        history.push("/sign-in");
      })
      .catch((error) => {
        console.log(error);
        alert("Error in Confirming Your Reset Password");
      });
  };

  return (
    <div className="form__container">
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
              className="password"
              placeholder="Your Password..."
            />
            <span class="form__input--focus"></span>
            <button
              class="form__input--eye"
              type="button"
              onClick={togglePassword}
            >
              <i class="far fa-eye" id="togglePassword"></i>
            </button>
          </div>
          <div className="form__input">
            <input
              type="password"
              name="token"
              className="passwordReset"
              placeholder="Password Reset Token..."
            />
            <span class="form__input--focus"></span>
            <button
              class="form__input--eye"
              type="button"
              onClick={togglePasswordReset}
            >
              <i class="far fa-eye" id="togglePasswordReset"></i>
            </button>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default ForgotRecovery;
