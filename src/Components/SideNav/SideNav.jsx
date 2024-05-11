import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuthController } from "./../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

import "./SideNav.scss";

function SideNav() {
  const { setIsLoggedIn, user } = useAuthController();
  const navigate = useNavigate();
  const mainRef = useRef(0);

  function handleLogOut() {
    navigate("/");
    document.cookie = "jwt" + "=" + null;
    setIsLoggedIn(false);
  }

  function handleNavVisible() {
    mainRef.current.style.left = 0;
    mainRef.current.style.zIndex = 3;
  }

  function handleNavHide() {
    mainRef.current.style.left = "-100%";
  }

  return (
    <>
      <div className="main-side-nav-div" ref={mainRef}>
        <p className="cross-btn">
          <span onClick={handleNavHide}>X</span>
        </p>
        <nav>
          <ul>
            <li onClick={handleNavHide}>
              <NavLink to={"/"}>Home</NavLink>
            </li>

            <li onClick={handleNavHide}>
              <NavLink to={"/createblog"}>Create Blog</NavLink>
            </li>

            <li onClick={handleNavHide}>
              <NavLink to={`/me/${user._id}`}>My Account</NavLink>
            </li>

            <li onClick={handleNavHide}>
              <NavLink to={"/about"}>About</NavLink>
            </li>

            <li onClick={handleNavHide}>
              <NavLink to={"/contact"}>Contact</NavLink>
            </li>

            <li onClick={handleLogOut}>
              <NavLink to={"/logout"}>LogOut</NavLink>
            </li>
          </ul>
        </nav>
        <div className="name-desc-div">
          <p className="name-letters-para">
            {user?.name?.split(" ")[0] || "User"}
          </p>

          <p className="intro-para">
            You're officially a part of our blogging family! Your account is
            your canvas, ready for your stories and insights. Embrace the
            opportunity to share your voice with the world. Happy blogging!
          </p>
        </div>
        <div className="copyright-div">
          <p>Copyright &copy;2024 All rights reserved</p>
        </div>
      </div>
      <div className="side-nav-menu" onClick={handleNavVisible}>
        <p>Menu</p>
      </div>
    </>
  );
}

export default SideNav;
