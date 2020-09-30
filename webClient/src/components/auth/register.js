import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useHistory, Link } from "react-router-dom";
import { signup } from "../../actions/authAction";
import { useDispatch } from "react-redux";

function Register() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [avatar, setAvatar] = useState(null);
  const recaptchaRef = React.createRef();
  const [error, setError] = useState({
    email: "",
    password: "",
    name: "",
    captcha: "",
  });

  React.useEffect(
    function effectFunction() {
      console.log("er", error);
    },
    [error]
  );

  let history = useHistory();
  let dispatch = useDispatch();

  const onInputChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    checkInputChange(name, val);
  };

  const checkInputChange = (fieldName, val) => {
    switch (fieldName) {
      case "name":
        if (val.length < 5)
          setError((prevError) => {
            return { ...prevError, name: "name length" };
          });
        else
          setError((prevError) => {
            return { ...prevError, name: "" };
          });
        break;
      case "password":
        if (val.length < 5)
          setError((prevError) => {
            return { ...prevError, password: "password length" };
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

  const imgAvatarUpload = (e) => {
    setAvatar(e.target.files[0]);
  };

  const register = (e) => {
    e.preventDefault();

    let { email, name, password } = e.target;
    console.log("e", email.value, name.value, password.value);
    const recaptchaValue = recaptchaRef.current.getValue();

    if (email.value.trim().length === 0) {
      setError((prev) => {
        return { ...prev, email: "Email cannot be null" };
      });
    } else
      setError((prev) => {
        return { ...prev, email: "" };
      });

    if (name.value.length < 5) {
      setError((prev) => {
        console.log("klfksldfkalkf");
        return { ...prev, name: "name cannot be null" };
      });
    } else
      setError((prev) => {
        console.log("klfksldfkalkf");
        return { ...prev, name: "" };
      });

    if (password.value.trim().length < 7) {
      setError((prev) => {
        console.log("klfksldfkalkf");
        return { ...prev, password: "pass cannot" };
      });
    } else
      setError((prev) => {
        console.log("klfksldfkalkf");
        return { ...prev, password: "" };
      });
    console.log("e3", error);

    for (const prop in error) {
      if (error[prop]) return;
    }
    console.log("after: ", error);

    // if (!recaptchaValue) {
    //   alert("dj");
    //   // setError({ ...error, captcha: "name cannot be null" });
    //   return;
    // }

    // avatar && console.log(avatar, " ", avatar.name);
    // let { email, password, name } = input;
    email = email.value;
    name = name.value;
    password = password.value;
    dispatch(signup({ email, password, name, avatar }));
    history.push("/");
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
        {error.email && <small>{error.email}</small>}

        <div className="form__input">
          <input
            type="text"
            name="name"
            onChange={onInputChange}
            placeholder="Username..."
          />
          <span class="form__input--focus"></span>
        </div>
        {error.name && <small>{error.name}</small>}

        <div className="form__input">
          <input
            type="password"
            name="password"
            onChange={onInputChange}
            // value={input.name}
            placeholder="Password..."
          />
          <span class="form__input--focus"></span>
        </div>
        {error.password && <small>{error.password}</small>}
        <input type="file" name="avatar" onChange={imgAvatarUpload} />
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
