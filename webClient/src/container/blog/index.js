import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import blogApi from "../../api/blogApi";
import Loading from "../../components/loading";
import Blog from "../../components/blog";
import "./index.scss";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const history = useHistory();

  useEffect(() => {
    async function getBlogs() {
      try {
        const params = {
          page: currentPage,
        };
        let res = await blogApi.getAll(params);
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
  }, [currentPage]);

  const showDetail = (id) => {
    console.log(id);
    history.push(`/blog/${id}`);
  };

  const handlePaginationChange = (e, value) => {
    console.log(e, value);
    setCurrentPage(value);
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
      <div className="items__pagination">
        <Pagination
          count={totalPage}
          page={currentPage}
          onChange={handlePaginationChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </>
  );
}

export default Blogs;
