import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import { Button } from "react-bootstrap";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import blogApi from "../../api/blogApi";
import * as blogsAction from "../../actions/blogsAction";

import MaterialTable from "material-table";
import "./index.scss";

function BlogList() {
  const columns = [
    { field: "id", title: "No." },
    { field: "_id", title: "ID" },
    { field: "title", title: "Title" },
    { field: "content", title: "Content" },
    { field: "thumbnail", title: "Thumbnail" },
    {
      field: "writer",
      title: "Writer",
    },
  ];

  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    async function fetchAllBlogs() {
      try {
        let res = await blogApi.getAll();
        console.log(res);
        let blogArray = res.blogs;
        blogArray.map((item, i) => (item.id = i));
        dispatch(blogsAction.loadBlogs(blogArray));
        console.log(blogArray);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllBlogs();
  }, []);

  const handleDelete = (data) => {
    try {
      let deleteIDs = [];

      async function deleteItems() {
        await Promise.all(
          data.map(async (item) => {
            let res = await blogApi.delete(item._id);
            if (res && res.msg === "success") {
              console.log(res);
              deleteIDs.push(item._id);
            }
          })
        );
        //  dispatch(itemsAction(deleteIDs));
      }
      deleteItems();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bloglist">
      <div className="bloglist__option">
        <Link to="/blogs/create">
          <Button variant="contained" color="primary">
            <AddIcon fontSize="large" />
            Create
          </Button>
        </Link>
      </div>
      <div className="bloglist__main">
        <div style={{ maxWidth: "100%" }}>
          <MaterialTable
            columns={columns}
            data={blogs.blogs}
            title="Demo Title"
            options={{
              selection: true,
            }}
            actions={[
              {
                tooltip: "Remove All Selected Users",
                icon: "delete",
                onClick: (evt, data) => {
                  handleDelete(data);
                },
              },
              {
                tooltip: "Edit",
                icon: "edit",
                onClick: (evt, data) => {
                  history.push("/dashboard");
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default BlogList;
