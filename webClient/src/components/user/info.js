import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import userApi from "../../api/userApi";
import "./user.scss";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        let res = await userApi.getUserInfo();
        console.log("user: ", res);
        setUser(res.user);
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, []);

  return (
    user && (
      <div className="user__container">
        {/* <div className="user">
          <div className="user__info">
            <span>ID: </span>
            <span>{user._id}</span>
          </div>
          <div className="user__info">
            <span>Email: </span> <span>{user.email}</span>
          </div>
          <div className="user__info">
            <span>Username:</span> <span>{user.name}</span>
          </div>
          <div className="user__info">
            <span>Cash: </span> <span>{user.cash}</span>
          </div>
        </div> */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ID</td>
              <td>{user._id}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td>Cash</td>
              <td>{user.cash}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  );
}

export default UserInfo;
