import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useHistory, Link } from "react-router-dom";
import { signup } from "../../actions/authAction";
import { useDispatch } from "react-redux";

function Register() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [avatar, setAvatar] = useState(null);
  const recaptchaRef = React.createRef();
  const [error, setError] = useState({
    email: "",
    password: "",
    username: "",
    captcha: "",
  });

  let history = useHistory();
  let dispatch = useDispatch();

  const onInputChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    checkInputChange(name, val);
  };

  const checkInputChange = (fieldName, val) => {
    switch (fieldName) {
      case "username":
        if (val.length < 5)
          setError((prevError) => {
            return { ...prevError, username: "username length" };
          });
        else
          setError((prevError) => {
            return { ...prevError, username: "" };
          });
        break;
      case "password":
        if (val.length < 5)
          setError((prevError) => {
            return { ...prevError, password: "password length" };
          });
        setError((prevError) => {
          return { ...prevError, password: "" };
        });
        break;
      default:
        break;
    }
  };

  const imgAvatarUpload = (e) => {
    setAvatar(e.target.files[0]);
  };

  const register = (e) => {
    e.preventDefault();

    let { email, username, password } = e.target;
    console.log("e", email.value, username.value, password.value);
    const recaptchaValue = recaptchaRef.current.getValue();

    if (email.value.trim().length === 0) {
      setError((prev) => ({ ...prev, email: "Email cannot be null" }));
    } else setError((prev) => ({ ...prev, email: "" }));
    console.log("e1", error);

    if (username.value.length === 0) {
      setError((prev) => ({ ...prev, username: "username cannot be null" }));
    } else setError((prev) => ({ ...prev, username: "" }));
    console.log("e2", error);

    if (password.value.trim().length < 7) {
      setError((prev) => ({ ...prev, password: "password cannot be null" }));
    } else setError((prev) => ({ ...prev, password: "" }));
    console.log("e3", error);

    for (const prop in error) {
      if (error[prop]) return;
    }
    console.log("after: ", error);

    // if (!recaptchaValue) {
    //   alert("dj");
    //   // setError({ ...error, captcha: "Username cannot be null" });
    //   return;
    // }

    // avatar && console.log(avatar, " ", avatar.name);
    // let { email, password, username } = input;
    email = email.value;
    username = username.value;
    password = password.value;
    dispatch(signup({ email, password, username, avatar }));
    history.push("/");
  };

  return (
    <div className="form register">
      <form id="register" onSubmit={register}>
        <Link to="/sign-in">Log In</Link>
        <input
          type="email"
          name="email"
          onChange={onInputChange}
          // value={input.email}
          placeholder="Your email..."
        />
        {error.email && <small>{error.email}</small>}

        <input
          type="text"
          name="username"
          onChange={onInputChange}
          // value={input.username}
          placeholder="Username"
        />
        {error.username && <small>{error.username}</small>}

        <input
          type="password"
          name="password"
          onChange={onInputChange}
          // value={input.password}
          placeholder="Your password"
        />
        {error.password && <small>{error.password}</small>}

        <input type="file" name="avatar" onChange={imgAvatarUpload} />
        <div className="recaptcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdBUdEZAAAAALoB9_fO6bxb-iiC39gHsKXxH4iW"
            onChange={console.log("captcha", 1)}
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Register;
