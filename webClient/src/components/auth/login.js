import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signIn } from "../../actions/authAction";
import "./form.scss";

function Login() {
  const recaptchaRef = React.createRef();
  let history = useHistory();
  let dispatch = useDispatch();

  const onInputChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);
  };

  const login = (e) => {
    e.preventDefault();

    const recaptchaValue = recaptchaRef.current.getValue();
    // if (!recaptchaValue) {
    //   alert("dj");
    //   setError({ ...error, captcha: "Captcha" });
    //   return;
    // }

    // let { username, password } = { ...input };
    let { email, password } = e.target;
    console.log("e", email.value, password.value);
    email = email.value;
    password = password.value;
    dispatch(signIn({ email, password }));
    history.push("/");
  };

  return (
    <div className="form login">
      <Link to="/forgot">Forgot Password</Link>
      <Link to="/sign-up">Not have an account?</Link>
      <form onSubmit={login}>
        <div className="form__input">
          <input
            type="email"
            name="email"
            onChange={onInputChange}
            // value={input.username}
            placeholder="Email..."
          />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input
            type="password"
            name="password"
            onChange={onInputChange}
            // value={input.password}
            placeholder="Your password"
          />
          <span class="form__input--focus"></span>
        </div>
        <div className="recaptcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdBUdEZAAAAALoB9_fO6bxb-iiC39gHsKXxH4iW"
            onChange={console.log(1)}
          />
        </div>
        <input type="submit" value="LOG IN" />
      </form>
    </div>
  );
}

export default Login;
