import React from "react";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import "./index.scss";

function ForgotRecovery(props) {
  const { onsubmit, back } = props;
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

  const handleBack = () => {
    if (back) back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, token } = e.target;
    if (onsubmit)
      onsubmit({
        newPassword: password.value,
        passwordResetToken: token.value,
      });
  };

  return (
    <div className="forgot__component">
      <form onSubmit={handleSubmit}>
        <div className="forgot__input form__input">
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
        <div className="forgot__input form__input">
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
        <span className="forgot__buttons-back">
          <Button onClick={handleBack} variant="contained" color="primary">
            <ArrowBackIcon />
            Back
          </Button>
        </span>
        <span className="forgot__buttons-submit">
          <Button type="submit" variant="contained" color="primary">
            SUBMIT
          </Button>
        </span>
      </form>
    </div>
  );
}

export default ForgotRecovery;
