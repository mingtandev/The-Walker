import React from "react";
import { useHistory } from "react-router-dom";

import blogApi from "../../api/blogApi";
import jwt_decode from "jwt-decode";
import { Button } from "@material-ui/core";

import "./index.scss";

function BlogCreate() {
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    const { title, content, thumbnail } = e.target;
    console.log(title.value, content.value, thumbnail.files[0]);

    let formData = new FormData();
    formData.append(
      "writer",
      localStorage.getItem("token")
        ? jwt_decode(localStorage.getItem("token"))._id
        : null
    );
    formData.append("title", title.value);
    formData.append("content", content.value);
    formData.append("thumbnail", thumbnail.files[0]);
    console.log(formData);

    blogApi
      .create(formData)
      .then((res) => {
        console.log(res);
        if (res && res.msg === "success") {
          console.log("rrr", res);
          history.push("/blogs");
          return;
        }
        alert("error creating blog");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="blogs__create">
        <div class="input-focus-effect">
          <input type="text" name="title" />
          <label>Title</label>
        </div>
        <textarea name="content" rows="5" placeholder="Content..."></textarea>
        <label className="blogs__label">
          Item Thumbnail (accepted: JPEG, JPG, PNG)
        </label>
        <input type="file" name="thumbnail" />
        <Button
          type="submit"
          className="blogs__submit"
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </form>
    </>
  );
}

export default BlogCreate;
