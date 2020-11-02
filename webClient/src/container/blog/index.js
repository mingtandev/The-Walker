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
import { useHistory } from "react-router-dom";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const blogStatus = useSelector((state) => state.blog.status);
  const dispatch = useDispatch();
  const history = useHistory();

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

  const showDetail = (id) => {
    console.log(id);
    history.push(`/blog/${id}`);
  };

  return (
    <>
      {blogStatus === "loading" && <Loading />}
      {blogStatus === "fail" && <div>FAIL TO FETCH BLOGS</div>}
      <div className="blogs__container">
        {blogs.length ? (
          blogs.map((item, id) => (
            <Blog onclick={() => showDetail(item._id)} key={id} {...item} />
          ))
        ) : (
          <div>NO BLOGS</div>
        )}
      </div>
    </>
  );
}

export default Blogs;
