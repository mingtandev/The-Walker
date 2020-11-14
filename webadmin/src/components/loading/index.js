import React from "react";
import { Link, NavLink } from "react-router-dom";

function Loading() {
  return (
    <div>
      Loading
      <Link to="/login"> Login</Link>
    </div>
  );
}

export default Loading;
