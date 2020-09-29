import React from "react";
import "./blog.scss";
import { blogposts } from "./blogposts";

function blogDetail({ match }) {
  let id = match.params.id;
  let blog = blogposts.find((blog) => JSON.stringify(blog.id) === id);
  return (
    <div className="blogpost">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
    </div>
  );
}

export default blogDetail;
