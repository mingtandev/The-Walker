import React from "react";
import jwt_decode from "jwt-decode";

function home() {
  if (localStorage.getItem("token")) {
    let user = jwt_decode(localStorage.getItem("token"));
    console.log(user);
  }
  return <div>Home</div>;
}

export default home;
