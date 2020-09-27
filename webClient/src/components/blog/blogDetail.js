import React from "react";
import { blogposts } from "./blogposts";

function blogDetail({ match }) {
  let id = match.params.id;
  let blog = blogposts.find((blog) => JSON.stringify(blog.id) === id);
  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
    </div>
  );
}

export default blogDetail;
