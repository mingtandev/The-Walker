import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./index.scss";

function Loading() {
  return (
    <div className="loading">
      <div className="loading__main">
        <CircularProgress />
      </div>
    </div>
  );
}

export default Loading;
