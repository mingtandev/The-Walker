import React from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { toastr } from "react-redux-toastr";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import userApi from "../../api/userApi";
import { PasswordValidation } from "../../utils/formValidation";

function UserUpdate() {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "100%",
      },
    },
  }));
  const classes = useStyles();

  const user = useSelector((state) => state.auth);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      toastr.error("Please Login Again!");
      return;
    }

    let { password, passwordConfirm } = e.target;

    if (!PasswordValidation(password.value)) {
      toastr.error(
        "Password MUST be between 6-20 characters including digit and lowercase letter"
      );
      return;
    }

    if (password.value.trim() !== passwordConfirm.value.trim()) {
      toastr.error("Confirmed password does not match");
      return;
    }

    let body = [{ propName: "password", value: password.value }];

    const userID = jwt_decode(localStorage.getItem("token"))._id;

    try {
      let res = await userApi.update(userID, body);
      console.log(res);
      if (res && res.msg === "success")
        toastr.success("Change Password Successfully");
    } catch (error) {
      toastr.error("Error Changing Password! Try Again!");
      console.log(error);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      toastr.error("Please Login Again!");
      return;
    }

    const { name } = e.target;
    if (name.value.length < 6 || name.value.length > 15) {
      toastr.warning("Name must be 6-15 characters");
      return;
    }
    let body = [{ propName: "name", value: name.value }];
    const userID = jwt_decode(localStorage.getItem("token"))._id;

    try {
      let res = await userApi.update(userID, body);
      console.log(res);
      if (res && res.msg === "success")
        toastr.success("Change Username Successfully");
    } catch (error) {
      console.log(error);
      toastr.error("Error Changing Username! Try Again!");
    }
  };

  return (
    user && (
      <div className="user__container user__update">
        <div className="user__update-form">
          <form
            className={classes.root}
            onSubmit={handleChangeUsername}
            autoComplete="true"
          >
            <TextField
              name="name"
              id="standard-required"
              label="New Username"
              inputProps={{ style: { fontSize: 15 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 15 } }}
            />
            <Button type="submit" variant="contained" color="primary">
              change username
            </Button>
          </form>
        </div>
        <div className="user__update-form">
          <form className={classes.root} onSubmit={handleChangePassword}>
            <TextField
              id="standard-password-input"
              label="New Password"
              type="password"
              name="password"
              inputProps={{ style: { fontSize: 15 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 15 } }}
            />
            <TextField
              label="Retype New Password"
              name="passwordConfirm"
              type="password"
              inputProps={{ style: { fontSize: 15 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 15 } }}
            />
            <Button type="submit" variant="contained" color="primary">
              change password
            </Button>
          </form>
        </div>
      </div>
    )
  );
}

export default UserUpdate;
