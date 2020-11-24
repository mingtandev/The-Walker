import React from "react";
import "./index.scss";
import { Spinner } from "react-bootstrap";

function Loading() {
  return (
    <div className="loading">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <span className="loading__title">LOADING CONTENT...</span>
    </div>
  );
}

export default Loading;
