import React from "react";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importing Components.........
import { useAuthController } from "./../../contexts/AuthProvider";
import Loader from "./../../Components/Loader/Loader";

// Importing Styles And Assets......
import "./Signup.modules.scss";
import background from "./../../assets/background.mp4";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [age, setAge] = useState(0);
  const [profession, setProfession] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { setUser, setIsLoggedIn, BASE_URL } = useAuthController();

  function handleSubmit(e) {
    e.preventDefault();
    setName(e.target[0].value);
    setEmail(e.target[1].value);
    setPassword(e.target[2].value);
    setpasswordConfirm(e.target[3].value);
    setAge(e.target[4].value * 1);
    setProfession(e.target[5].value);
  }

  useEffect(() => {
    async function signUp() {
      try {
        if (
          name === "" ||
          email === "" ||
          password === "" ||
          passwordConfirm === "" ||
          age === "" ||
          profession === ""
        )
          return;

        setIsLoading(true);

        const data = await axios({
          method: "POST",
          url: `${BASE_URL}/api/v1/users/signup`,
          data: {
            name,
            email,
            password,
            passwordConfirm,
            age,
            profession,
          },
        });

        setIsLoading(false);
        console.log(data?.data?.data?.user);
        setIsLoggedIn(true);
        setUser(data?.data?.data?.user);
        navigate("/");
      } catch (err) {
        if (err?.response?.data?.message !== undefined) {
          alert(err?.response?.data?.message);
        } else {
          alert(
            "Error while logging in , please check your internet connection or try again later"
          );
        }

        setIsLoading(false);
        console.log(err);
        console.log(err?.response?.data?.message);
        navigate("/signup");
      }
    }
    signUp();
  }, [name, email, password, passwordConfirm, age, profession]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main-form-div">
          <div className="form-div">
            <h3>SignUp</h3>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  id="name"
                  required
                  autoComplete="on"
                  placeholder="Type Your Full Name"
                />
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="email"
                  id="email"
                  required
                  autoComplete="on"
                  placeholder="Type Your Email Here......"
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <br />
                <input
                  type="password"
                  id="password"
                  required
                  autoComplete="on"
                  placeholder="Your password of 8 characters"
                />
              </div>

              <div>
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <br />
                <input
                  type="password"
                  id="passwordConfirm"
                  required
                  autoComplete="on"
                  placeholder="Confirm Your password"
                />
              </div>

              <div>
                <label htmlFor="age">Age</label>
                <br />
                <input
                  type="number"
                  id="age"
                  required
                  autoComplete="on"
                  placeholder="Type Your Current Age"
                />
              </div>

              <div>
                <label htmlFor="profession">Profession</label>
                <br />
                <input
                  type="text"
                  id="profession"
                  required
                  autoComplete="on"
                  placeholder="Write Your Current Profession"
                />
              </div>

              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          </div>
          <div className="form-video-div">
            <video autoPlay loop muted src={background}></video>
          </div>
          <div className="overlay-form-div"></div>
        </div>
      )}
    </>
  );
}

export default Signup;
