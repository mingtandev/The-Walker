import React from "react";

import "./index.scss";

function Blog(props) {
  const { _id, date, name, title, content, thumbnail, onclick } = props;

  const showDetail = () => {
    if (onclick) onclick(_id);
  };

  return (
    <div className="blog" onClick={showDetail}>
      <img className="blog__thumbnail" src={thumbnail} alt="blog" />
      <div className="blog__main">
        <p className="blog__title">{title}</p>
        <p className="blog__caption">{date}</p>
        <p className="blog__caption">Writer: {name}</p>
        <p className="blog__content">{content}</p>
      </div>
    </div>
  );
}

export default Blog;
