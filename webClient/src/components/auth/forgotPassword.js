import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import userApi from "../../api/userApi";
import "./form.scss";

function ForgotPassword() {
  const [error, setError] = useState("");
  let history = useHistory();

  const onInputChange = (e) => {
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let { email } = e.target;
    email = email.value;

    userApi
      .forgot({ email })
      .then((res) => {
        console.log(res);
        if (res.status !== 404)
        {
          alert("Check email for Password Reset Token");
          history.push("/forgot/recovery");
        }
      })
      .catch((error) => {
        setError("Can't find your Email");
        console.log(error);
      });
  };

  return (
    <div className="form__container">
      <div className="form forgetform">
        <Link className="forgetform__login" to="/sign-in">
          Back to login
        </Link>
        <Link className="forgetform__register" to="/sign-up">
          Register
        </Link>
        {error && <p className="form__error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form__input">
            <input
              type="email"
              name="email"
              onChange={onInputChange}
              placeholder="Your Email to Reset Password..."
            />
            <span class="form__input--focus"></span>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
