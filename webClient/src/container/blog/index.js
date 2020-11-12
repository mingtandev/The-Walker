import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import itemApi from "../../api/blogApi";

import Loading from "../../components/loading";
import Blog from "../../components/blog";
import { useHistory } from "react-router-dom";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getBlogs() {
      try {
        let res = await itemApi.getAll();
        console.log(res);
        if (res.msg === "success") {
          setBlogs(res.blogs);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getBlogs();
  }, []);

  const showDetail = (id) => {
    console.log(id);
    history.push(`/blog/${id}`);
  };

  return (
    <>
      {!loading ? (
        <div className="blogs__container">
          {blogs.length ? (
            blogs.map((item, id) => (
              <Blog onclick={() => showDetail(item._id)} key={id} {...item} />
            ))
          ) : (
            <div>NO BLOGS</div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Blogs;
