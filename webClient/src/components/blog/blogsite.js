import React from "react";
import "./blog.scss";
import { Link } from "react-router-dom";
import { blogposts } from "./blogposts";

function blog() {
  return (
    <div className="blogs">
      {blogposts.map((blog) => (
        <div className="blogs__blog" key={blog.id}>
          <h1 className="blog__title">{blog.title}</h1>
          <div className="blog__content">
            <p>{blog.content}</p>
          </div>
          <Link to={`/blog/${blog.id}`} className="blog__seemore">
            <p>See more &gt;&gt;&gt;</p>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default blog;
