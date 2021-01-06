import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./index.scss";

function Loading() {
  return (
    <div className="loading">
      <CircularProgress />
    </div>
  );
}

export default Loading;
