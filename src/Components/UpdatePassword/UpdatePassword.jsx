import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

import { useAuthController } from "./../../contexts/AuthProvider";

import "./UpdatePassword.scss";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { BASE_URL } = useAuthController();

  const { id } = useParams();
  const buttonRef = useRef();
  const navigate = useNavigate();

  function handleUpdateData(e) {
    e.preventDefault();
    setOldPassword(e.target[0].value);
    setNewPassword(e.target[1].value);
    setPasswordConfirm(e.target[2].value);
    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
  }

  useEffect(() => {
    async function updatePassword() {
      try {
        if (!oldPassword || !newPassword || !passwordConfirm) return;

        buttonRef.current.textContent = "Updating....";

        setIsLoading(true);

        const data = await axios({
          method: "PATCH",
          url: `${BASE_URL}/api/v1/users/update/password/${id}`,
          data: {
            oldPassword,
            newPassword,
            passwordConfirm,
          },
        });

        setIsLoading(false);

        navigate(`/me/${id}/update-password`);

        if (data?.data?.status === "success")
          alert("Password Updated Successfully");
      } catch (err) {
        setIsLoading(false);
        alert(err?.response?.data?.message);
        console.log(err);
        console.log(err?.reponse?.data?.message);
      }
    }
    updatePassword();
  }, [
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    passwordConfirm,
    setPasswordConfirm,
  ]);

  return (
    <>
      {isLoading ? (
        <div className="loader-div">
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className="update-data-container">
          <h3 className="update-data-heading">
            Update <span>Your Password</span>
          </h3>
          <form onSubmit={handleUpdateData}>
            <div>
              <label htmlFor="password">Current Password :-</label>
              <br />
              <input
                type="password"
                placeholder="••••••••"
                id="password"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword">New Password :-</label>
              <br />
              <input
                type="password"
                placeholder="••••••••"
                id="newPassword"
                required
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm">Password Confirm:-</label>
              <br />
              <input
                type="password"
                placeholder="••••••••"
                id="passwordConfirm"
                required
              />
            </div>

            <button ref={buttonRef} type="submit">
              Update Password
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default UpdatePassword;
