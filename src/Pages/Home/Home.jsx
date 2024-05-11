import React from "react";

import "./Home.scss";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="home-main-div">
      <Outlet />
    </div>
  );
}

export default Home;
