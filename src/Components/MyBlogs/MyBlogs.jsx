import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useAuthController } from "./../../contexts/AuthProvider";

import "./MyBlogs.scss";

function MyBlog() {
  const { BASE_URL, user } = useAuthController();
  const [allBlogs, setAllBlogs] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [blogsOwner, setBlogsOwner] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    async function getBlogsOwner() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}`,
        });

        setBlogsOwner(data?.data?.data?.doc);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getBlogsOwner();
  }, []);

  useEffect(() => {
    async function deleteBlog() {
      try {
        if (!isDelete || !deleteId) return;

        setIsLoading(true);

        const data = await axios({
          method: "DELETE",
          url: `${BASE_URL}/api/v1/blogs/${deleteId}`,
        });

        alert(data?.data?.message);

        setIsLoading(false);

        navigate(`/me/${id}`);
      } catch (err) {
        setIsLoading(false);

        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    deleteBlog();
  }, [deleteId, setDeleteId, isDelete, setIsDelete]);

  function handleDelete(id) {
    setDeleteId(id);
    setIsDelete(() => !isDelete);
  }

  useEffect(() => {
    async function getUser() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}`,
        });

        setLoggedInUser(data?.data?.data?.doc);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function getAllBlogsForOneUser() {
      try {
        if (!loggedInUser?.blogs?.length) return;

        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/blogs/one/user/${id}`,
        });

        setAllBlogs(data?.data?.data?.blogs);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getAllBlogsForOneUser();
  }, [loggedInUser, setLoggedInUser]);

  return (
    <>
      {blogsOwner?._id === user?._id ? (
        <>
          {!allBlogs.length ? (
            <div className="no-blogs-div">
              <p>You haven't created a blog yet</p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="loader-div">
                  <h3>Loading...</h3>
                </div>
              ) : (
                <div className="main-myblog-div">
                  <div className="myblog-container-div">
                    {allBlogs?.map((blog) => (
                      <OneBlog
                        user={user}
                        onDelete={handleDelete}
                        blog={blog}
                        key={blog._id}
                        id={id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {!allBlogs.length ? (
            <div className="no-blogs-div">
              <p>{blogsOwner?.name} haven't created a blog yet</p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="loader-div">
                  <h3>Loading...</h3>
                </div>
              ) : (
                <div className="main-myblog-div">
                  <div className="myblog-container-div">
                    {allBlogs?.map((blog) => (
                      <OneBlog
                        user={user}
                        onDelete={handleDelete}
                        blog={blog}
                        key={blog._id}
                        id={id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

function OneBlog({ blog, onDelete, user, id }) {
  return (
    <div className="blog-desc-container-div">
      {user._id === id && (
        <span onClick={() => onDelete(blog._id)} className="delete-blog">
          Delete
        </span>
      )}

      <p className="blog-heading">{blog?.heading}</p>
      <div className="blog-likes-comments">
        <div className="calendar-div">
          <i className="fa-calendar fa-regular"></i>
          <span className="calendar-span">{blog?.createdAt.split("T")[0]}</span>
        </div>

        <div className="category-div">
          <i className="fa-solid fa-folder"></i>
          <span className="folder-span">{blog?.category || "Category"}</span>
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
  );
}

export default MyBlog;
