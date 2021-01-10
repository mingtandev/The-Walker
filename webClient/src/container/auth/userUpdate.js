import React from "react";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { toastr } from "react-redux-toastr";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import userApi from "../../api/userApi";
import { loadUser } from "../../actions/authAction";
import { PasswordValidation } from "../../utils/formValidation";

function UserUpdate() {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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

    const userID = jwt_decode(localStorage.getItem("token"))._id;

    try {
      let res = await userApi.update(userID, { password: password.value });
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

    const { name, thumbnail } = e.target;
    if (name.value.length < 6 || name.value.length > 15) {
      toastr.warning("Name must be 6-15 characters");
      return;
    }
    const userID = jwt_decode(localStorage.getItem("token"))._id;

    let formData = new FormData();
    formData.append("name", name.value);
    if (thumbnail.files[0]) formData.append("thumbnail", thumbnail.files[0]);

    try {
      let res = await userApi.update(userID, formData);
      if (res && res.msg === "success") {
        toastr.success("Update Information Successfully");
        dispatch(loadUser(res.user));
      }
    } catch (error) {
      console.log(error);
      toastr.error("Error Changing Username! Try Again!");
    }
  };

  return (
    user && (
      <div className="user__update">
        <div className="user__update-form">
          <form onSubmit={handleChangeUsername} autoComplete="true">
            <TextField
              name="name"
              id="standard-required"
              label="Username"
              defaultValue={user.user.name}
              style={{ marginBottom: 20 }}
              inputProps={{ style: { fontSize: 15 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 15 } }}
            />
            <label>New Avatar (accepted: JPEG, JPG, PNG)</label>
            <input type="file" name="thumbnail" />
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </form>
        </div>
        <div className="user__update-form">
          <form onSubmit={handleChangePassword}>
            <TextField
              id="standard-password-input"
              label="New Password"
              type="password"
              name="password"
              style={{ marginBottom: 20 }}
              inputProps={{ style: { fontSize: 15 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 15 } }}
            />
            <TextField
              label="Retype New Password"
              name="passwordConfirm"
              type="password"
              style={{ marginBottom: 20 }}
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
