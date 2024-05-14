import React, { useEffect, useState } from "react";
import { useAuthController } from "./../../contexts/AuthProvider";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import defaultUserImage from "./../../assets/userImages/default.jpg";

import "./Following.scss";

function Following() {
  const { user, BASE_URL } = useAuthController();
  const [following, setFollowing] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    async function getAllFollowers() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}/following`,
        });

        setFollowing(data?.data?.data?.allFollowings);
      } catch (err) {
        alert("Error while fetching your followings , please try again later");
        console.log(err);
      }
    }
    getAllFollowers();
  }, [id]);

  return (
    <>
      {following.length === 0 && (
        <p className="no-followers-para">You didn't follow any blogger yet</p>
      )}

      {following.length > 0 && (
        <div className="main-mycomments-div">
          <div className="my-comments-container-div">
            <div>
              {following?.map((following) => {
                return (
                  <FollowingUser following={following} key={following._id} />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FollowingUser({ following }) {
  return (
    <Link to={`/${following._id}/user`}>
      <div>
        <img
          src={
            following?.photo !== "default.jpg"
              ? following.imageURL
              : defaultUserImage
          }
          alt="Commenter's Image"
        />
        <p className="users-comment-para">{following?.name || "User's Name"}</p>
      </div>
    </Link>
  );
}

export default Following;
