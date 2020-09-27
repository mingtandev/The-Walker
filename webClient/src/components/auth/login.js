import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signIn } from "../actions/authAction";
import "./form.scss";

function Login() {
  let history = useHistory();
  let dispatch = useDispatch();

  const [input, setInput] = useState({ username: "", password: "" });

  const onInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const login = (e) => {
    e.preventDefault();
    console.log(input.username, " ", input.password);
    let { username, password } = { ...input };
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
          value={input.username}
          placeholder="Username..."
        />
        <input
          type="password"
          name="password"
          onChange={onInputChange}
          value={input.password}
          placeholder="Your password"
        />
        <input type="submit" value="LOG IN" />
      </form>
    </div>
  );
}

export default Login;
