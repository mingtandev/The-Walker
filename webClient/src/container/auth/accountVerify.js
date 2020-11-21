import React from "react";
import { Link, useHistory } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import userApi from "../../api/userApi";
import "./index.scss";

function AccountVerify() {
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { email } = e.target;
    email = email.value;

    try {
      let res = await userApi.resend({ email });
      console.log(res);
      if (res) {
        if (res.msg === "success") {
          toastr.success(
            "Verify Successfully",
            "Check email and Activate Your Account"
          );
          history.push("/sign-in");
        } else if (res.msg === "Email not found!") {
          toastr.error("Email Not Found");
        } else toastr.error("Server Error", "Try Again Later");
      } else toastr.error("Server Error", "Try Again Later");
    } catch (error) {
      console.log(error);
    }
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
        <form onSubmit={handleSubmit}>
          <div className="form__input">
            <input
              type="email"
              name="email"
              placeholder="Your email to be verified..."
            />
            <span class="form__input--focus"></span>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default AccountVerify;
