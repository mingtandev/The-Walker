import React from "react";
import { toastr } from "react-redux-toastr";
import { useHistory } from "react-router-dom";
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
    console.log(email);
    try {
      // let res = await userApi.forgot({ email: email });
      // if (res && res.msg === "success")
      handleNext();
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
    // userApi
    //   .forgot({ email })
    //   .then((res) => {
    //     console.log(res);
    //     if (res) {
    //       if (res.msg === "success") {
    //         handleNext();
    //       } else if (res.msg === "ValidatorError")
    //         toastr.error("Validate Error", "Email Not Found");
    //       else toastr.error("Server error!", "Please Try Again");
    //     }
    //     toastr.error("Server error!", "Please Try Again");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toastr.error("Server error!", "Please Try Again");
    //   });
  };

  const handlePasswordReset = ({ newPassword, passwordResetToken }) => {
    console.log(newPassword, passwordResetToken);
    handleNext();
    // userApi
    //   .forgotConfirm({ newPassword, passwordResetToken })
    //   .then((res) => {
    //     if (res.msg !== "success") return;
    //     alert("Change password successfully");
    //     console.log(res);
    //     history.push("/sign-in");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     alert("Error in Confirming Your Reset Password");
    //   });
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <ForgotPassword onsubmit={handleEmailSubmit} />;
      case 1:
        return (
          <ForgotRecovery back={handleBack} onsubmit={handlePasswordReset} />
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div className="forgot__container">
      <Stepper
        // className={classes.root}
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
          <Typography>Account Verified. Login Again</Typography>
          <Button onClick={handleReset} variant="contained" color="primary">
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}
