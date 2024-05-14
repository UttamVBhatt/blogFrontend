import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Importing Components.........
import { useAuthController } from "./../../contexts/AuthProvider";
import Loader from "./../../Components/Loader/Loader";

// Importing Styles And Assets......
import "./Login.modules.scss";
import background from "./../../assets/background.mp4";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setIsLoggedIn, BASE_URL } = useAuthController();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setEmail(e.target[0].value);
    setPassword(e.target[1].value);
  }

  useEffect(() => {
    async function login() {
      try {
        if (email === "" && password === "") return;

        setIsLoading(true);

        const data = await axios({
          method: "POST",
          url: `${BASE_URL}/api/v1/users/login`,
          data: { email, password },
        });

        setUser(data?.data?.data.user);
        setIsLoading(false);
        setIsLoggedIn(true);
        navigate("/");
      } catch (err) {
        setIsLoading(false);

        if (err?.response?.data?.message !== undefined) {
          alert(err?.response?.data?.message);
        } else {
          alert(
            "Error while logging in , please check your internet connection or try again later"
          );
        }

        console.log(err);
        console.log(err?.response?.data?.message);
        navigate("/");
      }
    }
    login();
  }, [email, password, setUser, navigate]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="main-form-login-div">
          <div className="form-login-div">
            <h3>Login</h3>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email</label>

                <br />

                <FontAwesomeIcon icon={faEnvelope} />
                <input type="email" id="email" required autoComplete="on" />
              </div>

              <div>
                <label htmlFor="password">Password</label>

                <br />

                <FontAwesomeIcon icon={faLock} />
                <input
                  type="password"
                  id="password"
                  required
                  autoComplete="on"
                />
              </div>

              <p>
                Dont have an account ? <Link to="/signup">Create Account</Link>
              </p>

              <button type="submit" className="submit-btn">
                Login
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

export default Login;
