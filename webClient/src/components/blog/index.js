import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function Blog(props) {
  const { _id, date, writer, title, content, thumbnail } = props;
  return (
    <div className="blog">
      <img className="blog__img" src={thumbnail} alt="image" />
      <p className="blog__title">{title}</p>
      <p className="blog__content">{content}</p>
      <p className="blog__writer">Writer: {writer}</p>
      <Link to={`/blog/${_id}`} className="blog__seemore">
        <p>See more &gt;&gt;&gt;</p>
      </Link>
    </div>
  );
}

export default Blog;
