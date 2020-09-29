import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signIn } from "../../actions/authAction";
import "./form.scss";

function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const recaptchaRef = React.createRef();
  let history = useHistory();
  let dispatch = useDispatch();

  const onInputChange = (e) => {
    // setInput((prev) => ({
    //   input: { ...prev, [e.target.name]: e.target.value },
    // }));
    // console.log(input);
    // let { fieldName, value } = e.target;
    let name = e.target.name;
    let val = e.target.value;
    console.log(name, val);
  };

  const login = (e) => {
    e.preventDefault();
    // let { username, password } = { ...input };
    let { username, password } = e.target;
    console.log("e", username.value, password.value);
    username = username.value;
    password = password.value;
    dispatch(signIn({ username, password }));
    history.push("/");
  };

  return (
    <div className="form login">
      <Link to="/forgot">Forgot Password</Link>
      <Link to="/sign-up">Not have an account?</Link>
      <form onSubmit={login}>
        <input
          type="text"
          name="username"
          onChange={onInputChange}
          // value={input.username}
          placeholder="Username..."
        />
        <input
          type="password"
          name="password"
          onChange={onInputChange}
          // value={input.password}
          placeholder="Your password"
        />
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
