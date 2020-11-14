import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import blogApi from "../../api/blogApi";
import "./index.scss";

function BlogCreate() {
  const [blogInput, setBlogInput] = useState({
    title: "",
    content: "",
    file: null,
  });

  const onInputChange = (e) => {
    setBlogInput({ ...blogInput, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBlogInput({ ...blogInput, file: e.target.files[0] });
  };

  const create = (e) => {
    e.preventDefault();
    let { title, content, file } = blogInput;
    let formData = new FormData();
    formData.append("writer", jwt_decode(localStorage.getItem("token"))._id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("thumbnail", file);
    console.log(formData);

    blogApi
      .create(formData)
      .then((res) => {
        if (res && res.msg === "success") {
          console.log("rrr", res);
          return;
        }
        alert("error creating blog");
      })
      .catch((error) => {
        console.log("e", error.response.status);
      });
  };

  return (
    <div className="blogs__container">
      <form onSubmit={create} className="blogs__create">
        <h1>Write A Blog</h1>
        <input
          type="text"
          name="title"
          value={blogInput.title}
          onChange={onInputChange}
          placeholder="Title..."
        />
        <label>Item Thumbnail (accepted: JPEG, JPG, PNG)</label>
        <input type="file" name="thumbnail" onChange={handleFileChange} />
        <textarea
          name="content"
          value={blogInput.content}
          onChange={onInputChange}
          rows="10"
          placeholder="Content..."
        ></textarea>
        <input type="submit" value="Create" />
      </form>
    </div>
  );
}

export default BlogCreate;
