import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // JavaScript (includes Popper.js)
import "../css/Dashboard.css";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import Content from "./Content";
import Cont from "../NewDash/Cont";
import Slide from "../NewDash/Slide";
import Nav from "../NewDash/Nav";

const AshADmin = () => {
  useEffect(() => {
    const sidebarCollapse = document.getElementById("sidebarCollapse");
    const sidebar = document.getElementById("sidebar");

    const toggleSidebar = () => {
      sidebar.classList.toggle("active");
    };

    sidebarCollapse.addEventListener("click", toggleSidebar);

    // Cleanup to remove event listener on component unmount
    return () => {
      sidebarCollapse.removeEventListener("click", toggleSidebar);
    };
  }, []);
  return (
    <>
    <Nav/>
    
  <div className="wrapper">
    {/* Sidebar  */}
    <Slide/>
    {/* Page Content  */}
    <Outlet/>
  </div>

    </>
  );
};

export default AshADmin;


