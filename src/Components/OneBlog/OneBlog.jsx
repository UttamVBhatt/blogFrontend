import React, { useEffect, useRef, useState } from "react";
import { useAuthController } from "./../../contexts/AuthProvider";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Loader from "./../Loader/Loader";

import "./OneBlog.scss";

import defaultUserImage from "./../../assets/userImages/default.jpg";

import defaultBlogImage from "./../../assets/blog-default.png";

function OneBlog() {
  const { user, BASE_URL } = useAuthController();

  const [photo, setPhoto] = useState();

  const [blogUser, setBlogUser] = useState({});
  const [blog, setBlog] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [added, setAdded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [updatePhotoSpan, setUpdatePhotoSpan] = useState("Upload Blog Picture");

  const [loggedInUser, setLoggedInUser] = useState({});

  const navigate = useNavigate();

  const { id } = useParams();

  const userId = blog?.user;

  useEffect(() => {
    async function getLoggedInUser() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${user._id}`,
        });

        setLoggedInUser(data?.data?.data?.doc);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getLoggedInUser();
  }, []);

  useEffect(() => {
    async function getUser() {
      try {
        if (!userId) return;

        setIsLoading(true);

        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${userId}`,
        });

        setBlogUser(data?.data?.data?.doc);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getUser();
  }, [userId]);

  useEffect(() => {
    async function getBlog() {
      try {
        setIsLoading(true);

        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/blogs/${id}`,
        });

        setComments(data?.data?.data?.doc?.comments);
        setBlog(data?.data?.data?.doc);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);

        console.log(err?.response?.data?.message);
      }
    }
    getBlog();
  }, [id]);

  useEffect(() => {
    async function addComment() {
      try {
        if (!added) return;

        const data = await axios({
          method: "PATCh",
          url: `${BASE_URL}/api/v1/blogs/comment/${id}/${user._id}`,
          data: {
            user: user._id,
            comment: newComment,
          },
        });
      } catch (err) {
        console.log(err?.response?.data?.message);
      }
    }
    addComment();
  }, [added, setAdded, newComment, setNewComment]);

  function handleComments(e) {
    e.preventDefault();
    setComments([{ user, comment: e.target[0].value }, ...comments]);
    setAdded(true);
    setNewComment(e.target[0].value);
    e.target[0].value = "";
  }

  const handleLikeAndUnlike = async () => {
    try {
      setIsLoading(true);

      const data = await axios({
        method: "PATCH",
        url: `${BASE_URL}/api/v1/users/like`,
        data: {
          user,
          blogId: blog._id,
        },
      });

      setLoggedInUser(data?.data?.user);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.message);
    }
  };

  const uploadPhoto = async () => {
    const formData = new FormData();
    formData.append("photo", photo);

    if (!photo)
      return alert(
        "Please provide an image file! you can't upload empty image file"
      );

    setUpdatePhotoSpan("Uploading please wait.......");

    const data = await axios
      .patch(`${BASE_URL}/api/v1/blogs/upload-photo/${id}`, formData)
      .then((res) => res)
      .then((data) => data)
      .catch((err) => console.log(err));

    alert(data?.data?.message);

    setBlog(data?.data?.blog);

    setUpdatePhotoSpan("Upload Blog Picture");

    navigate("/");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main-one-blog-div">
          <div className="first-heading-div">
            <h3>
              This is the blog of
              <span> {blogUser?.name?.split(" ")[0] || "User"}</span>
            </h3>
          </div>

          <div className="blog-container-data-div">
            <div className="blog-image-heading-div">
              <Link to={`/${blogUser._id}/user`}>
                <img
                  src={
                    blog?.photo != "blog-default.png"
                      ? blog.imageURL
                      : defaultBlogImage || blog?.photo
                  }
                  alt="blog's image"
                />
              </Link>

              <p>
                Heading of this Blog is <span>{blog?.heading}</span>
              </p>
            </div>

            {blogUser._id === user._id && (
              <form className="picture-upload-form">
                <input
                  type="file"
                  id="photo"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                <button type="button" onClick={uploadPhoto}>
                  {updatePhotoSpan}
                </button>
              </form>
            )}

            <div className="description-container-div">
              <p>{blog?.description}</p>
            </div>

            <div className="like-comment-container-div">
              <div>
                <p>
                  <i
                    onClick={handleLikeAndUnlike}
                    className={`${
                      loggedInUser?.likes?.includes(id)
                        ? `fa-regular fa-heart heart`
                        : `fa-regular fa-heart`
                    }`}
                  ></i>
                  <span>
                    {loggedInUser?.likes?.includes(id) ? "Added" : ""}
                  </span>
                </p>

                <p>
                  <i className="fa-solid fa-comment"></i>
                  <span>{comments?.length || 0}</span>
                </p>
              </div>

              <form className="comment-form" onSubmit={handleComments}>
                <input type="text" placeholder="Add a Comment" required />
                <button type="submit">Add</button>
              </form>
            </div>

            <p className="all-comments-para">
              <span>All Comments :- </span>
            </p>

            <div className="all-comments-container-div">
              {comments?.map((comment, index) => (
                <AllComments
                  user={comment.user}
                  comment={comment}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AllComments({ user, comment }) {
  return (
    <>
      <div>
        <Link to={`/${user._id}/user`}>
          <img
            src={
              user?.photo != "default.jpg" ? user?.imageURL : defaultUserImage
            }
            alt="Commenter's Image"
          />
        </Link>
        <p>{comment.comment || "User's Comment"}</p>
      </div>
    </>
  );
}

export default OneBlog;
