import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useAuthController } from "./../../contexts/AuthProvider";
import Loader from "./../Loader/Loader";

import "./BlogsDiv.scss";
import blogDefault from "./../../assets/blog-default.png";

function BlogsDiv() {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { BASE_URL } = useAuthController();

  useEffect(() => {
    async function getBlogs() {
      try {
        setIsLoading(true);

        const allBlogsData = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/blogs`,
        });

        setAllBlogs(allBlogsData?.data?.data?.docs);

        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/blogs?sort=-createdAt&page=${page}&limit=${limit}`,
        });

        setBlogs(data?.data?.data?.docs);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getBlogs();
  }, [page, setPage]);

  const numberOfPages = Math.ceil(allBlogs.length / limit);

  function handleLeft() {
    page > 1 && setPage(() => page - 1);
  }

  function handleRight() {
    page < allBlogs.length / limit && setPage(() => page + 1);
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="blogs-main-div">
          <h3>
            <p>
              Welcome to the <span>bloggers</span> world ...
            </p>
          </h3>
          <div className="blog-container-div">
            {blogs?.map((blog) => (
              <Blog key={blog._id} blog={blog} />
            ))}
          </div>

          <div className="toggle-button-div">
            <button onClick={handleLeft}>&larr;</button>
            <div
              style={numberOfPages < 3 ? { width: "20%" } : { width: "40%" }}
              className={
                numberOfPages > 5
                  ? "pagination-div active-pagination"
                  : "pagination-div"
              }
            >
              {Array.from({ length: numberOfPages }).map((_, i) => (
                <span
                  data-set={i + 1}
                  key={i}
                  className={page === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <button onClick={handleRight}>&rarr;</button>
          </div>
        </div>
      )}
    </>
  );
}

function Blog({ blog }) {
  return (
    <div className="blog-div">
      <div className="blog-image-container-div">
        <img
          src={
            blog?.photo === "blog-default.png" ? blogDefault : blog?.imageURL
          }
          alt="blog's Image"
        />
      </div>

      <div className="blog-desc-container-div">
        <p className="blog-heading">
          {blog?.heading?.split(" ").splice(0, 3).join(" ") + "..."}
        </p>
        <div className="blog-likes-comments">
          <div className="calendar-div">
            <i className="fa-calendar fa-regular"></i>
            <span className="calendar-span">
              {blog?.createdAt.split("T")[0]}
            </span>
          </div>

          <div className="category-div">
            <i className="fa-solid fa-folder"></i>
            <span className="folder-span">
              {blog?.category?.split(" ")[0] || "Category"}
            </span>
          </div>

          <div className="comments-div">
            <i className="fa-solid fa-comment"></i>
            <span>{blog?.comments.length || 0}</span>
          </div>
        </div>
        <p className="blog-description">
          {blog?.description.split(" ").splice(0, 10).join(" ") + "..."}
        </p>
        <Link to={`/${blog?._id}`}>Read More...</Link>
      </div>
    </div>
  );
}

export default BlogsDiv;
