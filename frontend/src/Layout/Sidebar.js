import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [PanSuiteisOpen, setPanIsOpen] = useState(false);
  const [IdentityisOpen, setItentityIsOpen] = useState(false);
  const [CorporateisOpen, setCorporateIsOpen] = useState(false);


  useEffect(() => {
    const sidebarCollapse = document.getElementById("sidebarCollapse");
    const sidebar = document.getElementById("sidebar");

    if (sidebarCollapse && sidebar) {
      const toggleSidebar = () => {
        sidebar.classList.toggle("active");
      };

      sidebarCollapse.addEventListener("click", toggleSidebar);

      // Cleanup to remove event listener on component unmount
      return () => {
        sidebarCollapse.removeEventListener("click", toggleSidebar);
      };
    }
  }, []);

  const toggleSubmenu = (e) => {
    e.preventDefault();
    setIsOpen((prevState) => !prevState);
  };

  const togglePanSuiteSubmenu = (e) => {
    e.preventDefault();
    setPanIsOpen((prevState) => !prevState);
  };

  const toggleIdentitySubmenu = (e) => {
    e.preventDefault();
    setItentityIsOpen((prevState) => !prevState);
  };

  const toggleCorporateSubmenu = (e) => {
    e.preventDefault();
    setCorporateIsOpen((prevState) => !prevState);
  };
  

  return (
    <>
      {/* Sidebar  */}
      <nav id="sidebar">
        <ul className="list-unstyled components">
          <li>
            <Link to="#">Dashboard</Link>
          </li>
          <li>
            <Link
              href="#pageSubmenu"
              onClick={toggleSubmenu}
              className="dropdown-toggle"
              aria-expanded={isOpen}
            >
              API Verification
              <i
                className={`bx ms-2 ${
                  isOpen ? "bx-chevron-down" : "bx-chevron-right"
                }`}
              ></i>
            </Link>
            <ul
              className={`collapse list-unstyled ${isOpen ? "show" : ""}`}
              id="pageSubmenu"
            >
              {/* Pan suite */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={togglePanSuiteSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={PanSuiteisOpen}
                >
                  PAN SUITE
                  <i
                    className={`bx ms-2 ${
                      PanSuiteisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${PanSuiteisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="">PAN</Link>
                  </li>
                  <li>
                    <Link to="#">PAN DETAIL</Link>
                  </li>
                </ul>
              </li>
              {/* Pan suite */}
              {/* INDIVIDUAL IDENTIFY VERIFICATION */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleIdentitySubmenu}
                  className="dropdown-toggle"
                  aria-expanded={IdentityisOpen}
                >
                  INDIVIDUAL IDENTIFY VERIFICATION
                  <i
                    className={`bx ms-2 ${
                      IdentityisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${IdentityisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="#">AADHAAR VERIFICATION</Link>
                  </li>
                  <li>
                    <Link to="#">VOTER</Link>
                  </li>
                  <li>
                    <Link to="#">PASSPORT ID</Link>
                  </li>
                </ul>
              </li>
              {/* INDIVIDUAL IDENTIFY VERIFICATION */}
              {/* CORPORATE VERIFICATION */}
              <li>
                <Link
                  href="#pageSubmenu"
                  onClick={toggleCorporateSubmenu}
                  className="dropdown-toggle"
                  aria-expanded={CorporateisOpen}
                >
                  INDIVIDUAL IDENTIFY VERIFICATION
                  <i
                    className={`bx ms-2 ${
                      CorporateisOpen ? "bx-chevron-down" : "bx-chevron-right"
                    }`}
                  ></i>
                </Link>
                <ul
                  className={`collapse list-unstyled ${CorporateisOpen ? "show" : ""}`}
                  id="pageSubmenu"
                >
                  <li>
                    <Link to="#">AADHAAR VERIFICATION</Link>
                  </li>
                  <li>
                    <Link to="#">VOTER</Link>
                  </li>
                  <li>
                    <Link to="#">PASSPORT ID</Link>
                  </li>
                </ul>
              </li>
              {/* CORPORATE VERIFICATION */}
              <li>
                <Link to="#">CREDIT CHECK</Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="#">Reports</Link>
          </li>
          <li>
            <Link to="#">My Services</Link>
          </li>
          <li>
            <Link to="#">Settings</Link>
          </li>
          <li>
            <Link to="#">Funding</Link>
          </li>
          <li>
            <Link to="#">Onboarding Suit</Link>
          </li>
          <li>
            <Link to="#">Complaint</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
