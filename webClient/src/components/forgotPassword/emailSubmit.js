import React from "react";
import Button from "@material-ui/core/Button";
import "./index.scss";

function ForgotPassword(props) {
  const { onsubmit } = props;
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = e.target;
    if (onsubmit) onsubmit(email.value);
  };

  return (
    <div className="forgot__component">
      <form onSubmit={handleSubmit}>
        <div className="forgot__input form__input">
          <input
            type="email"
            name="email"
            placeholder="Your Email to Reset Password..."
          />
          <span class="form__input--focus"></span>
        </div>
        <Button type="submit" variant="contained" color="primary">
          SUBMIT
        </Button>
      </form>
    </div>
  );
}

export default ForgotPassword;
