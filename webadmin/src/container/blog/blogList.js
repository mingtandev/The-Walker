import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import BlogEditDialog from "../../components/dialog/blogEdit";
import DeleteConfirmBox from "../../components/dialog/deleteConfirm";
import blogApi from "../../api/blogApi";
import * as blogsAction from "../../actions/blogsAction";
import * as dataColumns from "../../utils/dataColumns";
import * as actions from "../../utils/actions";
import "./index.scss";

function BlogList() {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  async function getAllBlogs() {
    try {
      let res = await blogApi.getAll();
      console.log(res);
      let blogArray = res.blogs;
      // blogArray.map((item, i) => (item.id = i));
      dispatch(blogsAction.loadBlogs(blogArray));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllBlogs();
    return () => getAllBlogs();
  }, []);

  const handleDialogOpen = (rowData, e) => {
    setRowData(rowData);
    if (e === actions.EDIT) setUpdateOpen(true);
    else setDeleteConfirm(true);
  };

  const handleDialogClose = (e) => {
    if (e === actions.EDIT) setUpdateOpen(false);
    else setDeleteConfirm(false);
  };

  const handleDelete = async (data) => {
    try {
      let res = await blogApi.delete(data._id);
      console.log(res);
      if (res && res.msg === "success") {
        setDeleteConfirm(false);
        dispatch(blogsAction.deleteBlog(data._id));
      } else alert("Cannot delete blog");
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
    console.log(body);
    try {
      let res = await blogApi.update(blogId, body);
      console.log(res);
      if (res && res.msg === "success") {
        setUpdateOpen(false);
        getAllBlogs();
        return;
      }
      if (res && res.msg === "ValidatorError") {
        if (res.errors.title === "Title already exists!") {
          setError("Title already exists!");
        }
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
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.tableData.id % 2 === 0
                    ? "rgba(249, 249, 249, 0.6)"
                    : "#FFF",
              }),
            }}
            actions={[
              {
                tooltip: "Remove All Selected Users",
                icon: "delete",
                onClick: (evt, data) => {
                  handleDialogOpen(data, actions.DELETE);
                },
              },
              {
                tooltip: "Edit",
                icon: "edit",
                onClick: (evt, data) => {
                  handleDialogOpen(data, actions.EDIT);
                },
              },
            ]}
          />
        </div>
      </div>
      <BlogEditDialog
        onsubmit={handleUpdateBlog}
        data={rowData}
        show={updateOpen}
        error={error}
        onClearError={() => setError("")}
        onclose={() => handleDialogClose(actions.EDIT)}
      />
      <DeleteConfirmBox
        onsubmit={handleDelete}
        title="Delete this blog?"
        data={rowData}
        show={deleteConfirm}
        onclose={() => handleDialogClose(actions.DELETE)}
      />
    </div>
  );
}

export default BlogList;
