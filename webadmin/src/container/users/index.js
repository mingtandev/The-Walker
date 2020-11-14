import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import userApi from "../../api/userApi";
import * as usersAction from "../../actions/usersAction";

import MaterialTable from "material-table";
import UserEditDialog from "../../components/dialog/user";

import * as dataColumns from "../../utils/dataColumns";

function UsersList() {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const users = useSelector((state) => state.users);

  const dispatch = useDispatch();

  async function fetchAllUsers() {
    try {
      let res = await userApi.getAll();
      console.log(res);
      if (res && res.msg === "success") {
        let usersArray = res.users;
        dispatch(usersAction.loadUser(usersArray));
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleClickOpen = (rowData) => {
    setRowData(rowData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (data) => {
    try {
      let res = await userApi.delete(data._id);
      if (res && res.msg === "success")
        dispatch(usersAction.deleteUser(data._id));
      else alert("Cannot delete user");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUser = async (object, userId) => {
    console.log("neee", object, userId);
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }
    try {
      console.log("cll");
      let res = await userApi.update(userId, body);
      console.log(res);
      if (res && res.msg === "success") {
        fetchAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={dataColumns.USER_COLUMNS}
          data={users.users}
          title="USERS"
          options={{
            actionsColumnIndex: -1,
          }}
          actions={[
            {
              tooltip: "Remove All Selected Users",
              icon: "delete",
              onClick: (evt, data) => {
                handleDelete(data);
              },
            },
            (rowData) => ({
              icon: "edit",
              tooltip: "Edit",
              onClick: (event, rowData) => {
                handleClickOpen(rowData);
              },
            }),
          ]}
        />
      </div>
      <UserEditDialog
        onsubmit={handleUpdateUser}
        data={rowData}
        show={open}
        onclose={handleClose}
      />
    </>
  );
}

export default UsersList;
