import React from "react";
import "./loading.scss";
import { Spinner } from "react-bootstrap";

function BlogLoading() {
  return (
    <div className="loading">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <span className="loading__title">LOADING CONTENT...</span>
    </div>
  );
}

export default BlogLoading;
