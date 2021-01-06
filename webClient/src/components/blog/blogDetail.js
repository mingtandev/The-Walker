import React, { useEffect, useState } from "react";
import blogApi from "../../api/blogApi";
import Loading from "../../components/loading/circular";
import "./index.scss";

function BlogDetail({ match }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlog() {
      try {
        let id = match.params.id;
        let res = await blogApi.getOne(id);
        console.log("blog", res);
        if (res && res.msg === "success") setBlog(res.blog);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getBlog();
  }, []);

  return (
    <div className="blogDetail">
      {!loading ? (
        blog ? (
          <div className="blogDetail__main">
            <div className="blogDetail__caption">
              <p>{blog.date}</p>
              <p>Writer: {blog.name}</p>
            </div>
            <h1 className="blogDetail__title">{blog.title}</h1>
            <img
              className="blogDetail__thumbnail"
              src={blog.thumbnail}
              alt="#"
            />
            <p className="blogDetail__content">{blog.content}</p>
          </div>
        ) : (
          <div className="blogDetail__main">
            <h1 className="blogDetail__title">NO POSTS TO SHOW</h1>
          </div>
        )
      ) : (
        <div className="blogDetail__main">
          <div className="blogDetail__loading">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
