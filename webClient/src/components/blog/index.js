import React from "react";
import "./index.scss";

function Blog(props) {
  const { _id, date, writer, title, content, thumbnail, onclick } = props;

  const showDetail = () => {
    if (onclick) onclick(_id);
  };

  return (
    <div className="blog" onClick={showDetail}>
      <img className="blog__img" src={thumbnail} alt="image" />
      <p className="blog__title">{title}</p>
      <p className="blog__caption">
        {date} | {writer}
      </p>
      <p className="blog__content">{content}</p>
    </div>
  );
}

export default Blog;
