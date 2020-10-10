import React, { useState } from "react";
import "./blog.scss";

function BlogCreate() {
  const [blogInput, setBlogInput] = useState({ title: "", content: "" });

  const onInputChange = (e) => {
    setBlogInput({ ...blogInput, [e.target.name]: e.target.value });
  };

  const create = (e) => {
    e.preventDefault();
    let { title, content } = blogInput;
    console.log(title, " ", content);
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
