import React, { useEffect, useState } from "react";
import blogApi from "../../api/blogApi";
import "./index.scss";

function BlogDetail({ match }) {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function getBlog() {
      try {
        let id = match.params.id;
        console.log(id, typeof id);
        let res = await blogApi.getOne(id);
        console.log("blg", res);
        setBlog(res.blog);
      } catch (error) {
        console.log(error);
      }
    }
    getBlog();
  }, []);

  const handleUpdateBlog = (e) => {
    e.preventDefault();

    let form = [];
    for (let i = 0; i < e.target.length; i++) {
      console.log(i, e.target[i]);
      if (e.target[i].name === "thumbnail") {
        if (e.target[i].files[0])
          form.push({ propName: "thumbnail", value: e.target[i].files[0] });
      } else {
        if (e.target[i].value.trim())
          form.push({ propName: e.target[i].name, value: e.target[i].value });
      }
    }
    console.log(form);

    blogApi
      .update(match.params.id, form)
      .then((res) => {
        if (res && res.msg === "success") {
          console.log("rrr", res);
          return;
        }
        alert("error updating blog");
      })
      .catch((error) => {
        console.log("e", error);
      });
  };

  return (
    <div className="blogDetail">
      {blog ? (
        <>
          <h1 className="blogDetail__title">{blog.title}</h1>
          <p className="blogDetail__caption">Created on: {blog.date}</p>
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

      {/* <div className="blogs__update">
        <form className="form" onSubmit={handleUpdateBlog}>
          <input type="text" name="title" placeholder="Title..." />
          <input type="file" name="thumbnail" />
          <textarea
            name="content"
            rows="10"
            placeholder="Content..."
          ></textarea>
        </form>
      </div> */}
    </div>
  );
}

export default BlogDetail;
