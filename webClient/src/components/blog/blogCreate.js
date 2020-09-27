import React, { useState } from "react";
import { blogposts } from "./blogposts";

function BlogCreate() {
  const [blogInput, setBlogInput] = useState({ title: "", content: "" });

  const onInputChange = (e) => {
    setBlogInput({ ...blogInput, [e.target.name]: e.target.value });
  };

  const create = (e) => {
    e.preventDefault();
    console.log(blogInput.title, " ", blogInput.content);
    blogposts.push({
      id: 3,
      title: blogInput.title,
      content: blogInput.content,
    });
  };
  return (
    <div>
      <form onSubmit={create} className="blog__create">
        <input
          type="text"
          name="title"
          value={blogInput.title}
          onChange={onInputChange}
          placeholder="title"
        />
        <input
          type="text"
          name="content"
          value={blogInput.content}
          onChange={onInputChange}
          placeholder="content"
        />
        <input type="submit" value="create" />
      </form>
    </div>
  );
}

export default BlogCreate;
