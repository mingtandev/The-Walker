import React, { useEffect, useState } from "react";
import "./blog.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  blogLoading,
  blogLoaded,
  blogFailLoaded,
} from "../../actions/blogAction";
import blogApi from "../../api/blogApi";
import Loading from "../loading";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  let blogStatus = useSelector((state) => state.blog.status);
  let dispatch = useDispatch();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        let res = await blogApi.getAll();
        console.log(res);
        if (res.msg === "success") {
          setBlogs(res.blogs);
          dispatch(blogLoaded());
        }
      } catch (error) {
        console.log(error);
        dispatch(blogFailLoaded());
      }
    }
    fetchBlogs();
  }, [blogStatus, dispatch]);

  const deletePost = async (id) => {
    try {
      console.log(id);
      let res = await blogApi.delete(id);
      console.log(res);
      dispatch(blogLoading());
    } catch (error) {
      console.log(error);
    }
  };

  let content;
  if (blogStatus === "loading") {
    content = <Loading />;
    console.log("idle");
  } else if (blogStatus === "success") {
    console.log("idle");
    if (blogs.length) {
      content = blogs.map((blog) => (
        <div className="blogs__blog" key={blog._id}>
          <h1 className="blog__title">{blog.title}</h1>
          <div className="blog__content">
            <p>{blog.content}</p>
          </div>
          <button
            onClick={() => {
              deletePost(blog._id);
            }}
          >
            Delete
          </button>
          <Link to={`/blog/${blog._id}`} className="blog__seemore">
            <p>See more &gt;&gt;&gt;</p>
          </Link>
        </div>
      ));
    } else {
      content = <h1>NO BLOGS TO SHOW</h1>;
    }
  } else if (blogStatus === "fail") {
    console.log("fail");
    content = <div>FAIL TO FETCH BLOGS</div>;
  } else if (blogStatus === "idle") {
    dispatch(blogLoading());
    console.log("idle");
    content = <div>idle</div>;
  }

  return <div className="blogs__container">{content}</div>;
}

export default Blog;
