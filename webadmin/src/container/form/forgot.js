import React, { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ForgotPassword from "../../components/forgotPassword/emailSubmit";
import ForgotRecovery from "../../components/forgotPassword/resetPassword";
import userApi from "../../api/userApi";
import {
  EmailValidation,
  PasswordValidation,
} from "../../utils/formValidation";

import "./index.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    backgroundColor: "black",
    width: "100%",
    color: "red",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

export default function ForgotPasswordContainer() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const history = useHistory();

  function getSteps() {
    return ["Submit Email for Reset Password", "Reset Password"];
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleEmailSubmit = async (email) => {
    if (!EmailValidation(email)) {
      setEmailErr("Email Format Is Not Correct");
      return;
    }
    try {
      let res = await userApi.forgot({ email });
      if (res && res.msg === "success") handleNext();
      else if (res.msg === "ValidatorError") setEmailErr(res.errors.user);
      else setEmailErr("Server error!", "Please Try Again");
    } catch (error) {
      console.log(error);
      setEmailErr("Server error!", "Please Try Again");
    }
  };

  const handlePasswordReset = async ({ newPassword, passwordResetToken }) => {
    if (!PasswordValidation(newPassword)) {
      setPasswordErr(
        "Password MUST between 6-20 characters including digit and lowercase letter"
      );
      return;
    }

    try {
      let res = await userApi.forgotConfirm({
        newPassword,
        passwordResetToken,
      });
      if (res && res.msg === "success") {
        history.push("/login");
      } else if (res.msg === "ValidatorError") setPasswordErr(res.errors.user);
      else setPasswordErr("Server error!", "Please Try Again");
    } catch (error) {
      console.log(error);
      setPasswordErr("Server error!", "Please Try Again");
    }
  };

  const handleClearError = () => {
    setEmailErr("");
    setPasswordErr("");
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <ForgotPassword
            error={emailErr}
            clearError={handleClearError}
            onsubmit={handleEmailSubmit}
          />
        );
      case 1:
        return (
          <ForgotRecovery
            error={passwordErr}
            clearError={handleClearError}
            back={handleBack}
            onsubmit={handlePasswordReset}
          />
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div className="form__container">
      <div className="form form__forget">
        <div className="form__option">
          <NavLink to="/login">Back to Log In</NavLink>
        </div>
        <Stepper
          className={classes.root}
          activeStep={activeStep}
          orientation="vertical"
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>Change Password Successfully. Login Again</Typography>
            <Button onClick={handleReset} variant="contained" color="primary">
              Reset
            </Button>
          </Paper>
        )}
      </div>
    </div>
  );
}
