import React, { useEffect, useState } from "react";
import blogApi from "../../api/blogApi";
import userApi from "../../api/userApi";
import "./index.scss";

function BlogDetail({ match }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function getBlog() {
      try {
        let id = match.params.id;
        let res = await blogApi.getOne(id);
        console.log("blog", res);
        if (res && res.msg === "success") setBlog(res.blog);
      } catch (error) {
        console.log(error);
      }
    }

    getBlog();
  }, []);

  return (
    <div className="blogDetail">
      {blog ? (
        <>
          <h1 className="blogDetail__title">{blog.title}</h1>
          <p className="blogDetail__caption">Created on: {blog.date}</p>
          <p className="blogDetail__caption">Writer: {blog.name}</p>
          <img
            className="blogDetail__thumbnail"
            src={"http://" + blog.thumbnail}
            alt="#"
          />
          <p className="blogDetail__content">{blog.content}</p>
        </>
      ) : (
        <>
          <h1>NO POSTS TO SHOW</h1>
        </>
      )}
    </div>
  );
}

export default BlogDetail;
