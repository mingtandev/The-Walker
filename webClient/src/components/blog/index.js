import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";

import "./index.scss";

function Blog(props) {
  const { _id, date, writer, title, content, thumbnail, onclick } = props;

  const [writerInfo, setWriterInfo] = useState(null);

  useEffect(() => {
    async function getWriters() {
      try {
        let res = await userApi.getOne(_id);
        if (res.msg === "success") setWriterInfo(res);
      } catch (error) {
        console.log(error);
      }
    }
    getWriters();
  }, []);

  const showDetail = () => {
    if (onclick) onclick(_id);
  };

  return (
    <div className="blog" onClick={showDetail}>
      <img
        className="blog__thumbnail"
        src={"http://" + thumbnail}
        alt="image"
      />
      <p className="blog__title">{title}</p>
      <p className="blog__caption">
        {date} | {writerInfo && writerInfo.name}
      </p>
      <p className="blog__content">{content}</p>
    </div>
  );
}

export default Blog;
