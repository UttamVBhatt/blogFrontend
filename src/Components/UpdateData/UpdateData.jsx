import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

import { useAuthController } from "./../../contexts/AuthProvider";

import "./UpdateData.scss";

function UpdateData() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let { user, BASE_URL } = useAuthController();

  const { id } = useParams();
  const buttonRef = useRef();
  const navigate = useNavigate();

  function handleUpdateData(e) {
    e.preventDefault();
    setName(e.target[0].value);
    setEmail(e.target[1].value);
    e.target[0].value = "";
    e.target[1].value = "";
  }

  useEffect(() => {
    async function updateData() {
      try {
        if (!name || !email) return;

        buttonRef.current.textContent = "Updating....";

        setIsLoading(true);

        const data = await axios({
          method: "PATCH",
          url: `${BASE_URL}/api/v1/users/${id}`,
          data: {
            name,
            email,
          },
        });

        setIsLoading(false);

        navigate(`/me/${id}/update-data`);

        if (data?.data?.status === "success") alert(data?.data?.message);

        user.name = data?.data?.data?.user.name;
        user.email = data?.data?.data?.user.email;
      } catch (err) {
        alert(err?.response?.data?.message);
        console.log(err);
        console.log(err?.reponse?.data?.message);
      }
    }
    updateData();
  }, [name, setName, email, setEmail]);

  return (
    <>
      {isLoading ? (
        <div className="loader-div">
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className="update-data-container">
          <h3 className="update-data-heading">
            Update <span>Your Data</span>
          </h3>
          <form onSubmit={handleUpdateData}>
            <div>
              <label htmlFor="name">Name :-</label>
              <br />
              <input type="text" placeholder={user?.name} id="name" required />
            </div>

            <div>
              <label htmlFor="email">Email :-</label>
              <br />
              <input
                type="email"
                placeholder={user?.email}
                id="email"
                required
              />
            </div>

            <button ref={buttonRef} type="submit">
              Update Data
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default UpdateData;
