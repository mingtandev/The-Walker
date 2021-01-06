import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import "./index.scss";

function Loading() {
  return (
    <div className="loading">
      <div className="loading__main">
        <Skeleton />
        <Skeleton animation={false} />
        <Skeleton animation="wave" />
      </div>
    </div>
  );
}

export default Loading;
