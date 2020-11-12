import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import userApi from "../../api/userApi";
import * as usersAction from "../../actions/usersAction";

import MaterialTable from "material-table";

function UsersList() {
  const columns = [
    { field: "id", title: "No." },
    { field: "_id", title: "ID" },
    { field: "name", title: "Name" },
    { field: "slugName", title: "Slug Name" },
    { field: "email", title: "Email" },
    {
      field: "cash",
      title: "Cash",
    },
    {
      field: "roles",
      title: "Role",
    },
    {
      field: "isVerified",
      title: "Is Verified",
    },
  ];

  const users = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        let res = await userApi.getAll();
        console.log(res);
        let usersArray = res.users;
        usersArray.map((item, i) => (item.id = 2 * i + 1));
        dispatch(usersAction.loadUser(usersArray));
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllUsers();
  }, []);

  const handleDelete = (data) => {
    try {
      let deleteIDs = [];

      async function deleteUsers() {
        await Promise.all(
          data.map(async (item) => {
            let res = await userApi.delete(item._id);
            if (res && res.msg === "success") {
              console.log(res);
              deleteIDs.push(item._id);
            }
          })
        );
        dispatch(usersAction.deleteUser(deleteIDs));
        setTimeout(() => {
          console.log(users.users);
        }, 5000);
      }
      deleteUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={columns}
          data={users.users}
          title="Demo Title"
          options={{
            selection: true,
          }}
          actions={[
            {
              tooltip: "Remove All Selected Users",
              icon: "delete",
              onClick: (evt, data) => {
                handleDelete(data);
              },
            },
            {
              tooltip: "Edit",
              icon: "edit",
              onClick: (evt, data) => {
                history.push("/dashboard");
              },
            },
          ]}
        />
      </div>
    </>
  );
}

export default UsersList;
