import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { signup } from "../actions/authAction";
import { useDispatch } from "react-redux";

function Register() {
  const [input, setInput] = useState({ email: "", password: "", username: "" });
  let history = useHistory();
  let dispatch = useDispatch();

  const onInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const register = (e) => {
    e.preventDefault();
    let { email, password, username } = { ...input };
    dispatch(signup({ email, password, username }));
    // console.log(email, password, username);
    history.push("/");
  };

  return (
    <div className="form register">
      <form onSubmit={register}>
        <Link to="/sign-in">Log In</Link>
        <input
          type="email"
          name="email"
          onChange={onInputChange}
          value={input.email}
          placeholder="Your email..."
        />
        <input
          type="password"
          name="password"
          onChange={onInputChange}
          value={input.password}
          placeholder="Your password"
        />
        <input
          type="text"
          name="username"
          onChange={onInputChange}
          value={input.username}
          placeholder="Username"
        />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Register;
