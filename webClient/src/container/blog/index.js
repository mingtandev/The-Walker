import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import itemApi from "../../api/blogApi";
import {
  blogLoading,
  blogLoaded,
  blogFailLoaded,
} from "../../actions/blogAction";
import Loading from "../../components/loading";
import Blog from "../../components/blog";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const blogStatus = useSelector((state) => state.blog.status);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getBlogs() {
      try {
        let res = await itemApi.getAll();
        if (res.msg === "success") {
          setBlogs(res.blogs);
          dispatch(blogLoaded());
        }
      } catch (error) {
        console.log(error);
        dispatch(blogFailLoaded());
      }
    }
    getBlogs();
  }, [blogStatus, dispatch]);

  if (blogStatus === "idle") {
    dispatch(blogLoading());
  }

  return (
    <>
      {blogStatus === "loading" && <Loading />}
      {blogStatus === "fail" && <div>FAIL TO FETCH BLOGS</div>}
      <div className="blogs__container">
        {blogStatus === "success" && blogs.length ? (
          blogs.map((item, id) => <Blog key={id} {...item} />)
        ) : (
          <div>NO BLOGS</div>
        )}
      </div>
    </>
  );
}

export default Blogs;
