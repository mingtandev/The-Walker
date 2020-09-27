import React from "react";
import { Link } from "react-router-dom";
import { blogposts } from "./blogposts";

function blog() {
  return (
    <div className="blogs">
      {blogposts.map((blog) => (
        <div className="blogs__blog" key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          <Link to={`/blog/${blog.id}`}>See more</Link>
        </div>
      ))}
    </div>
  );
}

export default blog;
