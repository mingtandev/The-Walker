import React from "react";
import { Link } from "react-router-dom";
import "./form.scss";

function forgotPassword() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // let { username, password } = { ...input };
    let { email } = e.target;
    console.log("e", email.value);
    email = email.value;
  };

  return (
    <div className="form forgetform">
      <Link className="forgetform__login" to="/sign-in">
        Back to login
      </Link>
      <Link className="forgetform__register" to="/sign-up">
        Register
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="form__input">
          <input
            type="email"
            name="email"
            // value={input.password}
            placeholder="Your Email..."
          />
          <span class="form__input--focus"></span>
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default forgotPassword;
