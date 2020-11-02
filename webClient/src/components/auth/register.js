import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useHistory } from "react-router-dom";
import userApi from "../../api/userApi";
import userItemApi from "../../api/userItemApi";
import { toastr } from "react-redux-toastr";
import historyApi from "../../api/historyApi";

function Register() {
  const recaptchaRef = React.createRef();
  const [error, setError] = useState({
    email: "",
    password: "",
    name: "",
    captcha: "",
  });
  let history = useHistory();

  const onInputChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    checkInputChange(name, val);
  };

  const checkInputChange = (fieldName, val) => {
    switch (fieldName) {
      case "name":
        if (val.length < 6 || val.length > 15)
          setError((prevError) => {
            return {
              ...prevError,
              name: "Name length must be between 6 to 15 characters",
            };
          });
        else
          setError((prevError) => {
            return { ...prevError, name: "" };
          });
        break;
      case "password":
        if (val.length < 6 || val.length > 20)
          setError((prevError) => {
            return {
              ...prevError,
              password: "Password must be between 6 to 20 characters",
            };
          });
        else
          setError((prevError) => {
            return { ...prevError, password: "" };
          });
        break;
      default:
        break;
    }
  };

  const togglePassword = (e) => {
    e.preventDefault();
    let x = document.getElementById("password");
    let passwordEye = document.getElementById("togglePassword");
    x.type === "password" ? (x.type = "text") : (x.type = "password");
    passwordEye.classList.toggle("fa-eye-slash");
  };

  const register = (e) => {
    e.preventDefault();
    let { email, name, password } = e.target;
    const recaptchaValue = recaptchaRef.current.getValue();

    if (!email.value) {
      toastr.error("Oops!", "Please Fill out email");
      return;
    }

    if (name.value.length < 6 || name.value.length > 15) {
      toastr.error("Oops!", "Name must be from 6-15 characters");
      return;
    }

    if (password.value.length < 6 || password.value.length > 20) {
      toastr.error("Oops!", "Password length must be from 6-20 characters");
      return;
    }

    if (!recaptchaValue) {
      alert("Check reCaptcha!");
      return;
    }

    email = email.value;
    name = name.value;
    password = password.value;
    userApi
      .signUp({ name, email, password })
      .then((res) => {
        console.log(res);
        if (res && res.msg === "success") {
          toastr.success(
            "Sign Up Successfully",
            "Check your email for validation"
          );
          userItemApi
            .create(res.user._id)
            .then((res) => console.log("userItem", res))
            .catch((error) => console.log("userItem", error));
          historyApi
            .create(res.user._id)
            .then((res) => console.log("history", res))
            .catch((error) => console.log("history", error));
          history.push("/sign-in");
        }
      })
      .catch((error) => {
        alert("Error in Register! Please Try again");
        console.log(error);
      });
  };

  return (
    <div className="form__container form__container--smallertop">
      <div className="form form__register">
        <form id="register" onSubmit={register}>
          <Link to="/sign-in">I have an account</Link>
          <div className="form__input">
            <input
              type="email"
              name="email"
              onChange={onInputChange}
              placeholder="Email..."
            />
            <span class="form__input--focus"></span>
          </div>
          {error.email && (
            <small className="form__input--error">{error.email}</small>
          )}

          <div className="form__input">
            <input
              type="text"
              name="name"
              onChange={onInputChange}
              placeholder="Username..."
            />
            <span class="form__input--focus"></span>
          </div>
          {error.name && (
            <small className="form__input--error">{error.name}</small>
          )}

          <div className="form__input">
            <input
              type="password"
              name="password"
              id="password"
              onChange={onInputChange}
              placeholder="Password..."
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
          {error.password && (
            <small className="form__input--error">{error.password}</small>
          )}

          <div className="recaptcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
            />
          </div>
          <input type="submit" value="SIGN UP" />
        </form>
      </div>
    </div>
  );
}

export default Register;
