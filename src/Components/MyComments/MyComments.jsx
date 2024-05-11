import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./MyComments.scss";

import { useAuthController } from "./../../contexts/AuthProvider";
import defaultUserImage from "./../../assets/userImages/default.jpg";

function MyComments() {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setAllComments] = useState([]);
  const [commentId, setCommentId] = useState("");
  const [blogId, setBlogId] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [blogsUser, setBlogsUser] = useState({});

  const { BASE_URL, user } = useAuthController();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getBlogsUser() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}`,
        });

        setBlogsUser(data?.data?.data?.doc);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getBlogsUser();
  }, []);

  useEffect(() => {
    async function deleteComment() {
      try {
        if (!commentId || !blogId) return;

        setIsLoading(true);

        const data = await axios({
          method: "DELETE",
          url: `${BASE_URL}/api/v1/blogs/${blogId}/${commentId}/${id}`,
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
    deleteComment();
  }, [commentId, setCommentId, blogId, setBlogId]);

  useEffect(() => {
    async function getAllComments() {
      try {
        setIsLoading(true);

        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/blogs`,
        });

        // Getting All  Comments of One User;
        const arrayOfComments = data?.data?.data?.docs?.flatMap(
          (blog) => blog.comments
        );

        const commentsArray = [];

        arrayOfComments.map((commentObj) => {
          if (commentObj.user === id) return commentsArray.unshift(commentObj);
        });

        setAllComments(commentsArray);

        // Getting All Blogs for Corresponding Comment
        const blogsArray = [];

        data?.data?.data?.docs.map((blog) => {
          blog.comments.forEach((comment) => {
            commentsArray.forEach((gotcomment) => {
              if (gotcomment._id === comment._id) {
                return blogsArray.unshift(blog);
              }
            });
          });
        });

        setBlogs(blogsArray);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getAllComments();
  }, []);

  function handleDeleteComment(index) {
    setBlogId(blogs[index]._id);
    setCommentId(comments[index]._id);
  }

  return (
    <>
      {blogsUser?._id === user?._id ? (
        <>
          {!comments.length ? (
            <div className="no-blogs-div">
              <p>You haven't wrote any comment yet</p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="loader-div">
                  <h3>Loading...</h3>
                </div>
              ) : (
                <div className="main-mycomments-div">
                  <div className="my-comments-container-div">
                    {comments?.map((commentObj, index) => (
                      <CommentsOfUser
                        key={commentObj._id}
                        commentObj={commentObj}
                        user={user}
                        blogsUser={blogsUser}
                        index={index}
                        onDeleteComment={handleDeleteComment}
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
          {!comments.length ? (
            <div className="no-blogs-div">
              <p>{blogsUser?.name} haven't wrote any comment yet</p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="loader-div">
                  <h3>Loading...</h3>
                </div>
              ) : (
                <div className="main-mycomments-div">
                  <div className="my-comments-container-div">
                    {comments?.map((commentObj, index) => (
                      <CommentsOfUser
                        key={commentObj._id}
                        commentObj={commentObj}
                        user={user}
                        blogsUser={blogsUser}
                        index={index}
                        onDeleteComment={handleDeleteComment}
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

function CommentsOfUser({
  commentObj,
  user,
  index,
  onDeleteComment,
  blogsUser,
}) {
  return (
    <div>
      {user._id === blogsUser._id && (
        <div className="delete-text-div">
          <p onClick={() => onDeleteComment(index)}>Delete this comment</p>
        </div>
      )}

      <div>
        <img
          src={
            blogsUser?.photo !== "default.jpg"
              ? blogsUser.imageURL
              : defaultUserImage
          }
          alt="Commenter's Image"
        />
        <p className="users-comment-para">
          {commentObj.comment || "User's Comment"}
        </p>
      </div>
    </div>
  );
}

export default MyComments;
