import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signUp } from "../../actions/authAction";
import userApi from "../../api/userApi";
import jwt_decode from "jwt-decode";

function Register() {
  const [avatar, setAvatar] = useState(null);
  const recaptchaRef = React.createRef();
  const [error, setError] = useState({
    email: "",
    password: "",
    name: "",
    captcha: "",
  });
  let dispatch = useDispatch();

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
    console.log("jsdkjkdafj", x.value);
    x.type === "password" ? (x.type = "text") : (x.type = "password");
    passwordEye.classList.toggle("fa-eye-slash");
  };

  const imgAvatarUpload = (e) => {
    // setAvatar(e.target.files[0]);
  };

  const register = async (e) => {
    e.preventDefault();
    let { email, name, password } = e.target;
    console.log("e", email.value, name.value, password.value);
    const recaptchaValue = recaptchaRef.current.getValue();

    // checkInputSubmit(email, name, password);

    if (!email.value) {
      alert("Please Fill out email");
      return;
    }

    if (name.value.length < 6 || name.value.length > 15) {
      alert("Username length must be from 6-15 characters");
      return;
    }

    if (password.value.length < 6 || password.value.length > 20) {
      alert("Password length must be from 6-20 characters");
      return;
    }

    console.log("after: ", error);

    for (const prop in error) {
      if (error[prop]) {
        console.log("find e");
        return;
      }
    }

    if (!recaptchaValue) {
      alert("Check reCaptcha!");
      // setError({ ...error, captcha: "name cannot be null" });
      return;
    }

    avatar && console.log(avatar, " ", avatar.name);
    email = email.value;
    name = name.value;
    password = password.value;

    console.log("try");
    try {
      let res = await userApi.signUp({ name, email, password });
      console.log(res);
      if (res.msg === "Email has been used!") {
        console.log("Email used");
        return;
      }
      if (res.msg === "Server error!") {
        console.log("server err");
        return;
      }
      // localStorage.setItem("token", res.token);
      // localStorage.setItem("refreshtoken", res.refreshToken);
      alert("Check your email for validation");
      if (res.token) {
        let user = jwt_decode(res.token);
        console.log(user);
        dispatch(signUp(user));
        return <Redirect to="/" />;
      }
    } catch (error) {
      console.log(error);
      return <Redirect to="/" />;
    }
  };

  return (
    <div className="form register">
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

        <div className="form__input">
          <input type="file" name="avatar" onChange={imgAvatarUpload} />
        </div>
        <div className="recaptcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdBUdEZAAAAALoB9_fO6bxb-iiC39gHsKXxH4iW"
            onChange={console.log("captcha", 1)}
          />
        </div>
        <input type="submit" value="SIGN UP" />
      </form>
    </div>
  );
}

export default Register;
