import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useHistory } from "react-router-dom";
import userApi from "../../api/userApi";
import { toastr } from "react-redux-toastr";
import {
  EmailValidation,
  NameValidation,
  PasswordValidation,
} from "../../utils/formValidation";
import "./index.scss";

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

  const register = (e) => {
    e.preventDefault();
    let { email, name, password, retypePassword } = e.target;
    email = email.value;
    name = name.value;
    password = password.value;
    retypePassword = retypePassword.value;

    const recaptchaValue = recaptchaRef.current.getValue();

    if (!EmailValidation(email)) {
      toastr.error("Oops!", "Email Format Is Not Correct");
      return;
    }

    if (!NameValidation(name)) {
      toastr.error(
        "Username MUST between 6-15 characters including lowercase letter"
      );
      return;
    }

    if (!PasswordValidation(password)) {
      toastr.error(
        "Password MUST between 6-20 characters including digit and lowercase letter"
      );
      return;
    }

    if (password.trim() !== retypePassword.trim()) {
      toastr.error("Password and Confirmed Password NOT Match");
      return;
    }

    if (!recaptchaValue) {
      alert("Check reCaptcha!");
      return;
    }

    userApi
      .signUp({ name, email, password })
      .then((res) => {
        console.log(res);
        if (res) {
          if (res.msg === "success") {
            toastr.success(
              "Sign Up Successfully",
              "Check your email for validation"
            );
            history.push("/sign-in");
          } else {
            if (res.errors) {
              for (let error in res.errors)
                toastr.error("Register Failed", res.errors[error]);
            }
          }
          return;
        }
        toastr.warning("Register Failed", "Try Again Later");
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
          <Link to="/account/verify">Verify account</Link>
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
              onChange={onInputChange}
              placeholder="Password..."
            />
            <span class="form__input--focus"></span>
          </div>
          {error.password && (
            <small className="form__input--error">{error.password}</small>
          )}
          <div className="form__input">
            <input
              type="password"
              name="retypePassword"
              onChange={onInputChange}
              placeholder="Retype Password..."
            />
            <span class="form__input--focus"></span>
          </div>

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
