import React from "react";
import { Link } from "react-router-dom";
import "./form.scss";

function forgetPassword() {
  return (
    <div className="form forgetform">
      <Link className="forgetform__login" to="/sign-in">
        Back to login
      </Link>
      <Link className="forgetform__register" to="/sign-up">
        Register
      </Link>
      <form>
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default forgetPassword;
