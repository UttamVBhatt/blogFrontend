import React, { useEffect, useState } from "react";
import { useAuthController } from "./../../contexts/AuthProvider";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import defaultUserImage from "./../../assets/userImages/default.jpg";

import "./Followers.scss";

function Followers() {
  const { user, BASE_URL } = useAuthController();
  const [followers, setFollowers] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    async function getAllFollowers() {
      try {
        const data = await axios({
          method: "GET",
          url: `${BASE_URL}/api/v1/users/${id}/followers`,
        });

        setFollowers(data?.data?.data?.allFollowers);
      } catch (err) {
        alert("Error while fetching your followers , please try again later");
        console.log(err);
      }
    }
    getAllFollowers();
  }, []);

  return (
    <>
      {!followers?.length && (
        <p className="no-followers-para">You don't have any follower yet</p>
      )}

      {followers?.length > 1 && (
        <div className="main-mycomments-div">
          <div className="my-comments-container-div">
            <div>
              {followers?.map((follower) => {
                <Follower follower={follower} key={follower._id} />;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Follower({ follower }) {
  return (
    <Link to={`/${follower._id}/user`}>
      <div>
        <img
          src={
            follower?.photo !== "default.jpg"
              ? follower.imageURL
              : defaultUserImage
          }
          alt="Commenter's Image"
        />
        <p className="users-comment-para">{follower?.name || "User's Name"}</p>
      </div>
    </Link>
  );
}

export default Followers;
