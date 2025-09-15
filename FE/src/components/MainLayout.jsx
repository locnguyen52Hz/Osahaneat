import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import style from "../assets/styles/MainLayout.module.css";

import NavBar from "./NavBar";


function MainLayout() {

  const token = localStorage.getItem('token')
  return (
    
      <div className={style.mainLayout}>
        <SideBar />
        <div className={style.mainContent}>
          <NavBar />
          <div className={style.pagePadding}>
            <Outlet />
          </div>
        </div>
      </div>
    
  );
}

export default MainLayout;
