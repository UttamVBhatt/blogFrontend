import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuthController } from "./../../contexts/AuthProvider";

import defaultUserImage from "./../../assets/userImages/default.jpg";

import { Link, Outlet, useParams } from "react-router-dom";

import "./Me.scss";

function Me() {
  const { BASE_URL } = useAuthController();
  const { id } = useParams();

  const [photo, setPhoto] = useState();
  const [user, setUser] = useState({});
  const [updatePhotoSpan, setUpdatePhotoSpan] = useState("Upload Image");

  const photoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}`,
        });

        setUser(data?.data?.data?.doc);

        navigate(`/me/${id}`);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getUser();
  }, [photo, setPhoto]);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("photo", photo);

    if (!formData.photo)
      return alert(
        "Please provide an image file!, you can't upload empty image file"
      );

    setUpdatePhotoSpan("Uploading please wait....");

    const data = await axios
      .patch(`${BASE_URL}/api/v1/users/upload-photo/${user._id}`, formData)
      .then((res) => res.data)
      .catch((err) => console.log(err))
      .finally();

    alert(data?.message);

    setUpdatePhotoSpan("Upload Photo");

    navigate(`/`);

    setUser(data?.data?.user);
  };

  return (
    <div className="account-main-div">
      <div className="account-container-div">
        <h3>
          {user.name && (
            <>
              <span>
                {user?.name
                  ?.split(" ")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
              's profile
            </>
          )}
        </h3>

        <div className="account-detail-div">
          <div className="user-image-div">
            <img
              src={
                user?.photo !== "default.jpg"
                  ? user?.imageURL
                  : defaultUserImage
              }
              alt={user?.name}
            />

            <form>
              <input
                ref={photoRef}
                type="file"
                name="photo"
                onChange={(e) => setPhoto(e.target.files[0])}
                accept="image/*"
              />

              <button type="button" onClick={uploadImage}>
                {updatePhotoSpan}
              </button>
            </form>
          </div>

          <div className="user-details-div">
            <p className="">
              Hello, {user?.name} welcome to your profile page, here you can
              update your password , update your data like email, name, picture,
              see all your blogs , all your liked blogs , your comments, your
              number of followers , user to whom you follow , etc. all in one
              place at your profile page.
            </p>

            <div className="follow-unfollow-div">
              {id === user?._id ? (
                <>
                  <span>
                    Followers : <span> {user?.followers?.length || 0}</span>
                  </span>

                  <span className="following-span">
                    Following : <span>{user?.following?.length || 0}</span>
                  </span>
                </>
              ) : (
                <>
                  <button>Follow</button>
                  <button>Unfollow</button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="filter-div">
          <Link to={`/me/${id}/update-data`}>
            <p> Update Data</p>
          </Link>

          <Link to={`/me/${id}`}>
            <p> Update Password</p>
          </Link>

          <Link to={`/me/${id}/my-likes`}>
            <p> My Likes</p>
          </Link>

          <Link to={`/me/${id}/my-blogs`}>
            <p> My Blogs</p>
          </Link>

          <Link to={`/me/${id}/my-comments`}>
            <p> My Comments</p>
          </Link>
        </div>

        <div className="filter-result-div">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Me;
