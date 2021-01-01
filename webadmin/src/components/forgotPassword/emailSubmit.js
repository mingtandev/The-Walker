import React from "react";
import Button from "@material-ui/core/Button";
import "./index.scss";

function ForgotPassword(props) {
  const { error, clearError, onsubmit } = props;
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = e.target;
    if (onsubmit) onsubmit(email.value);
  };

  const handleClearError = () => {
    if (clearError) clearError();
  };

  return (
    <div className="forgot__component">
      <form onSubmit={handleSubmit}>
        {error && <label class="form__error">{error}</label>}
        <div className="forgot__input form__input">
          <input
            onChange={handleClearError}
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
