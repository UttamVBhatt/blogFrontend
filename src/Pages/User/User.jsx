import React, { useEffect, useState } from "react";
import axios from "axios";

import { useAuthController } from "./../../contexts/AuthProvider";
import defaultImage from "./../../assets/userImages/default.jpg";

import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import "./User.scss";

function Me() {
  const { BASE_URL, user } = useAuthController();
  const [loggedInUser, setLoggedInUser] = useState();
  const [blogsUser, setBlogsUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

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
    async function getBlogsUser() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}`,
        });

        if (id === user._id) return navigate(`/me/${id}`);

        setBlogsUser(data?.data?.data?.doc);
      } catch (err) {
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    getBlogsUser();
  }, []);

  const handleFollowUser = async () => {
    try {
      setIsLoading(true);

      const data = await axios({
        method: "GET",
        url: `${BASE_URL}/api/v1/users/follow/${id}/${loggedInUser?._id}`,
      });

      alert(data?.data?.message);

      setLoggedInUser(data?.data?.user);

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      console.log(err?.response?.data?.message);
    }
  };

  return (
    <div className="account-main-div">
      {isLoading ? (
        <div className="loader-div">
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className="account-container-div">
          <h3>
            {blogsUser.name && (
              <>
                <span>
                  {blogsUser?.name
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
                  blogsUser?.photo === "default.jpg"
                    ? defaultImage
                    : blogsUser?.imageURL
                }
                alt={blogsUser?.name}
              />
            </div>

            <div className="user-details-div">
              <p className="">
                Hello, {loggedInUser?.name} welcome to my profile page, here you
                can see my picture, see all my blogs , all my liked blogs , my
                comments, my number of followers , user to whom i follow , etc.
                all in one place at my profile page.
              </p>

              <div className="follow-unfollow-div">
                {id === loggedInUser?._id ? (
                  <>
                    <span>
                      Followers :{" "}
                      <span> {loggedInUser?.followers.length || 0}</span>
                    </span>

                    <span className="following-span">
                      Following :{" "}
                      <span>{loggedInUser?.following.length || 0}</span>
                    </span>
                  </>
                ) : (
                  <>
                    {loggedInUser?.following?.includes(blogsUser?._id) && (
                      <span>You Follow {blogsUser?.name}</span>
                    )}

                    {!loggedInUser?.following?.includes(blogsUser?._id) && (
                      <button onClick={handleFollowUser}>Follow</button>
                    )}

                    <button onClick={handleFollowUser}>Unfollow</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="filter-div">
            <Link to={`/${id}/user/my-likes`}>
              <p>{blogsUser?.name?.split(" ")[0]}'s Likes</p>
            </Link>

            <Link to={`/${id}/user`}>
              <p>{blogsUser?.name?.split(" ")[0]}'s Blogs</p>
            </Link>

            <Link to={`/${id}/user/my-comments`}>
              <p>{blogsUser?.name?.split(" ")[0]}'s Comments</p>
            </Link>
          </div>

          <div className="filter-result-div">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}

export default Me;
