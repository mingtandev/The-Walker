import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "material-table";
import userApi from "../../api/userApi";
import UserEditDialog from "../../components/dialog/userUpdate";
import DeleteConfirmBox from "../../components/dialog/deleteConfirm";
import * as usersAction from "../../actions/usersAction";
import * as actions from "../../utils/actions";
import * as dataColumns from "../../utils/dataColumns";

function UsersList() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [error, setError] = useState("");
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  async function fetchAllUsers() {
    try {
      let res = await userApi.getAll();
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

  const handleClickOpen = (rowData, e) => {
    setRowData(rowData);
    if (e === actions.EDIT) setEditOpen(true);
    else setDeleteConfirm(true);
  };

  const handleClose = (e) => {
    if (e === actions.EDIT) setEditOpen(false);
    else setDeleteConfirm(false);
  };

  const handleDelete = async (data) => {
    try {
      let res = await userApi.delete(data._id);
      if (res && res.msg === "success") {
        dispatch(usersAction.deleteUser(data._id));
        setDeleteConfirm(false);
      } else alert("Cannot delete user");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUser = async (object, userId) => {
    try {
      let res = await userApi.update(userId, object);
      console.log(res);
      if (res && res.msg === "success") {
        fetchAllUsers();
        setEditOpen(false);
        return;
      }
      if (res && res.msg === "ValidatorError") {
        if (res.errors.name === "Name already exists!")
          setError(res.errors.name);
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
              tooltip: "Remove User",
              icon: "delete",
              onClick: (evt, data) => {
                handleClickOpen(data, actions.DELETE);
              },
            },
            () => ({
              icon: "edit",
              tooltip: "Update User",
              onClick: (event, rowData) => {
                handleClickOpen(rowData, actions.EDIT);
              },
            }),
          ]}
        />
      </div>
      <UserEditDialog
        onsubmit={handleUpdateUser}
        data={rowData}
        show={editOpen}
        error={error}
        onClearError={() => setError("")}
        onclose={() => handleClose(actions.EDIT)}
      />
      <DeleteConfirmBox
        onsubmit={handleDelete}
        title="Delete this user?"
        data={rowData}
        show={deleteConfirm}
        onclose={() => handleClose(actions.DELETE)}
      />
    </>
  );
}

export default UsersList;
