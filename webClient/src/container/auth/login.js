import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signIn } from "../../actions/authAction";
import userApi from "../../api/userApi";
import jwt_decode from "jwt-decode";
import { toastr } from "react-redux-toastr";
import { EmailValidation } from "../../utils/formValidation";
import AOS from "aos";

import "./index.scss";

function Login() {
  const [loginErr, setLoginErr] = useState("");
  const recaptchaRef = React.createRef();
  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  const onInputChange = (e) => {
    setLoginErr("");
  };

  const login = async (e) => {
    e.preventDefault();

    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      alert("Check reCaptcha!");
      return;
    }

    let { email, password } = e.target;
    email = email.value;
    password = password.value;

    if (!EmailValidation(email)) {
      toastr.error("Oops!", "Email Format Is Not Correct");
      return;
    }

    try {
      let res = await userApi.signIn({ email, password });
      if (res.msg === "ValidatorError") {
        if (res.errors.user === "User not found!") {
          setLoginErr("Email or Password is not correct");
          return;
        }
        if (res.errors.user === "Email or password does not match!") {
          setLoginErr("Wrong Password");
          return;
        }
        if (res.errors.user === "Your account has not been verified!") {
          toastr.error("Your account has not been verified!");
          return;
        }
      } else if (res.msg === "success") {
        setLoginErr("");
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);
        let user = jwt_decode(res.token);
        dispatch(signIn(user));
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      setLoginErr("Email or Password is not correct");
    }
  };

  return (
    <div className="form__container">
      <div data-aos="flip-right" className="form form__login">
        <form onSubmit={login}>
          <Link to="/account/forgot">Forgot Password</Link>
          <Link to="/sign-up">Not have an account?</Link>
          {loginErr && <p className="form__error">{loginErr}</p>}
          <div className="form__input">
            <input
              type="email"
              name="email"
              onChange={onInputChange}
              placeholder="Email..."
            />
            <span class="form__input--focus"></span>
          </div>
          <div className="form__input">
            <input
              type="password"
              name="password"
              id="password"
              onChange={onInputChange}
              placeholder="Your password"
            />
            <span class="form__input--focus"></span>
          </div>
          <div className="recaptcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
            />
          </div>
          <input type="submit" value="LOG IN" />
        </form>
      </div>
    </div>
  );
}

export default Login;
