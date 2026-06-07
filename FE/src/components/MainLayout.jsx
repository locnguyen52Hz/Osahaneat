import React, { useState } from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import style from "../assets/styles/MainLayout.module.css";

import NavBar from "./NavBar";

function MainLayout() {
  const [showSideBar, setShowSideBar] = useState(true);
  console.log(showSideBar);
  return (
    <div className={style.layout}>
      <NavBar onToggleSideBar={() => setShowSideBar((prev) => !prev)} />

      <div className={style.body}>
        <SideBar isOpen={showSideBar} />

        <div className={style.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
