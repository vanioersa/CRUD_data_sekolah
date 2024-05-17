import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faChalkboardTeacher,
  faChild,
  faDoorOpen,
  faBook,
  faSignOutAlt,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

function Sidebar_Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar && !sidebar.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (pathname) => location.pathname === pathname;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: faDashboard },
    { href: "/murid", label: "Murid", icon: faChild },
    { href: "/guru", label: "Guru", icon: faChalkboardTeacher },
    { href: "/kelas", label: "Kelas", icon: faDoorOpen },
    { href: "/mapel", label: "Mapel", icon: faBook },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari Data Sekolah!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Berhasil!",
          text: "Anda telah berhasil keluar.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => (window.location.href = "/login"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Dibatalkan!",
          text: "Anda membatalkan keluar",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div style={{ backgroundColor: isOpen ? "#495E57" : "" }}>
        {isLoggedIn && (
          <div id="viewport" className={isOpen ? "open" : ""}>
            <div id="sidebar">
              <header
                style={{ paddingTop: "8px", paddingBottom: "8px" }}
                className="px-4"
              >
                <button
                  className="text-center"
                  onClick={() => {
                    window.location.reload();
                  }}
                  style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSchool}
                    style={{ marginRight: "10px", fontSize: "25px" }}
                  />
                  Data Sekolah
                </button>
              </header>
              <ul
                className={`nav flex-column ${isOpen ? "activest" : "active"}`}
              >
                <>
                  {navItems.map((item) => (
                    <li
                      key={item.href}
                      className={`nav-item ${
                        isActive(item.href) ? "active" : ""
                      }`}
                    >
                      <a className="nav-link" href={item.href}>
                        <FontAwesomeIcon icon={item.icon} className="padi" />{" "}
                        {item.label}
                      </a>
                    </li>
                  ))}

                  <li className="nav-item">
                    <Link className="nav-link" onClick={handleLogout} to="#">
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span
                        style={{ marginLeft: "15px" }}
                        className="logout-text"
                      >
                        Keluar
                      </span>
                    </Link>
                  </li>
                </>
              </ul>
            </div>
          </div>
        )}
        <div id="content">
          <nav
            className="navbar navbar-default"
            style={{
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              width: "100%",
              position: "fixed",
              zIndex: 999,
              padding: "15px 50px",
              top: 0,
            }}
          >
            <button
              className="text-center"
              onClick={() => {
                window.location.reload();
              }}
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faSchool}
                style={{ marginRight: "10px", fontSize: "25px" }}
              />
              Data Sekolah
            </button>

            <div className="navbar-links">
              {isLoggedIn && !isOpen && (
                <>
                  {navItems.map((item) => (
                    <a key={item.href} className="space" href={item.href}>
                      <span
                        className={`nav-items ${
                          isActive(item.href) ? "actives" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  ))}
                  <Link className="space" onClick={handleLogout} to="#">
                    <span className="logout-text">Keluar</span>
                  </Link>
                </>
              )}
              {!isOpen && !isLoggedIn && (
                <>
                  {navItems.map((item) => (
                    <Link key={item.href} className="space" to={item.href}>
                      <span
                        className={`nav-items ${
                          isActive(item.href) ? "actives" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>
            {isLoggedIn ? (
              <button
                className={`btn-toggle ${isOpen ? "hide" : ""}`}
                onClick={toggleSidebar}
                aria-expanded={isOpen}
                aria-label="Toggle sidebar"
              >
                {isOpen ? "☰" : "≡"}
              </button>
            ) : (
              <button
                className={`btn-toggle ${isOpen ? "hide" : ""}`}
                onClick={toggleSidebar}
                aria-expanded={isOpen}
                aria-label="Toggle sidebar"
              >
                {isOpen ? "" : null}
              </button>
            )}
          </nav>
        </div>
      </div>
      {showBackToTop && (
        <button
          className="btn-back-to-top"
          onClick={handleBackToTop}
          aria-label="Back to Top"
          style={{ zIndex: 9999 }}
        >
          ↑
        </button>
      )}

      <div className="bottom-margin" />

      <style>
        {`
      .bottom-margin {
        margin-bottom: 7%;
      }

      @media (max-width: 767px) {
        .bottom-margin {
          margin-bottom: 23%;
        }
      }

      .btn-back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #078bf0;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s;
      }

      .btn-back-to-top:hover {
        opacity: 0.8;
      }
      `}
      </style>
    </>
  );
}

export default Sidebar_Navbar;
