import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BlogEditDialog from "../../components/dialog/blogEdit";
import blogApi from "../../api/blogApi";
import * as blogsAction from "../../actions/blogsAction";
import * as dataColumns from "../../utils/dataColumns";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import "./index.scss";

function BlogList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const blogs = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  async function getAllBlogs() {
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

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleDialogOpen = (rowData) => {
    setRowData(rowData);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (data) => {
    try {
      let res = await blogApi.delete(data._id);
      console.log(res);
      if (res && res.msg === "success")
        dispatch(blogsAction.deleteBlog(data._id));
      else alert("Cannot delete blog");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateBlog = async (object, blogId) => {
    let body = [];
    for (const property in object) {
      if (object[property])
        body.push({ propName: property, value: object[property] });
    }
    try {
      let res = await blogApi.update(blogId, body);
      console.log(res);
      if (res && res.msg === "success") {
        setDialogOpen(false);
        getAllBlogs();
      }
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
            columns={dataColumns.BLOG_COLUMNS}
            data={blogs.blogs}
            title="BLOGS"
            options={{
              actionsColumnIndex: -1,
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
                  handleDialogOpen(data);
                },
              },
            ]}
          />
        </div>
      </div>
      <BlogEditDialog
        onsubmit={handleUpdateBlog}
        data={rowData}
        show={dialogOpen}
        onclose={handleDialogClose}
      />
    </div>
  );
}

export default BlogList;
