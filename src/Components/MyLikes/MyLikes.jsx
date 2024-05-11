import React, { useEffect, useState } from "react";
import axios from "axios";

import { useAuthController } from "./../../contexts/AuthProvider";

import { useParams } from "react-router-dom";

import "./MyLikes.scss";

function MyLikes() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [blogUser, setBlogUser] = useState([]);
  const [blogOwner, setBlogOwner] = useState({});

  const { BASE_URL, user } = useAuthController();
  const { id } = useParams();

  useEffect(() => {
    async function getBlogsOwner() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}`,
        });

        setBlogOwner(data?.data?.data?.doc);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getBlogsOwner();
  }, []);

  useEffect(() => {
    async function getAllBlogUsers() {
      try {
        const allBlogUsers = allBlogs?.map(async (blog) => {
          const data = await axios({
            method: "GET",
            url: `${BASE_URL}/api/v1/users/${blog.user}`,
          });

          return data?.data?.data?.doc;
        });

        const finalBlogUsers = await Promise.all(allBlogUsers);

        setBlogUser(finalBlogUsers);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getAllBlogUsers();
  }, [allBlogs, setAllBlogs]);

  useEffect(() => {
    async function getAllBlogs() {
      try {
        if (!loggedInUser?.likes?.length) return;

        const allBlogs = loggedInUser?.likes?.map(async (id) => {
          const data = await axios({
            method: "GET",
            url: `${BASE_URL}/api/v1/blogs/${id}`,
          });

          return data?.data?.data?.doc;
        });

        const finalBlogs = await Promise.all(allBlogs);

        setAllBlogs(finalBlogs);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getAllBlogs();
  }, [loggedInUser, setLoggedInUser]);

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

  return (
    <>
      {user?._id === blogOwner?._id ? (
        <>
          {!loggedInUser?.likes?.length ? (
            <div className="no-likes-div">
              <p>You haven't liked a blog yet.</p>
            </div>
          ) : (
            <div className="likes-main-div">
              <h4 className="your-likes-heading">
                {id === blogOwner?._id ? blogOwner?.name : "Your"}
                's
                <span> Likes :-</span>
              </h4>
              <div className="likes-container-div">
                {allBlogs.map((blog, i) => (
                  <LikesDiv
                    key={blog._id}
                    blogUser={blogUser}
                    index={i}
                    blog={blog}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {!blogOwner?.likes?.length ? (
            <div className="no-likes-div">
              <p>{blogOwner?.name} haven't liked a blog yet.</p>
            </div>
          ) : (
            <div className="likes-main-div">
              <h4 className="your-likes-heading">
                {id === blogOwner?._id ? blogOwner?.name : "Your"}
                's
                <span> Likes :-</span>
              </h4>
              <div className="likes-container-div">
                {allBlogs.map((blog, i) => (
                  <LikesDiv
                    key={blog._id}
                    blogUser={blogUser}
                    index={i}
                    blog={blog}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function LikesDiv({ blog, blogUser, index }) {
  return (
    <div className="liked-blog-div">
      <p className="blog-heading-para">{blog.heading}</p>
      <p className="author-name-para">
        Written By :- <span>{blogUser[index]?.name}</span>
      </p>
    </div>
  );
}

export default MyLikes;
