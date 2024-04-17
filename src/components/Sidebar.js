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
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function Sidebar_Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const closeOnOutsideClick = (e) => {
      if (
        isOpen &&
        !e.target.closest("#sidebar") &&
        !e.target.closest(".btn-toggle")
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", closeOnOutsideClick);
    return () => window.removeEventListener("click", closeOnOutsideClick);
  }, [isOpen]);

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
          text: "Anda telah berhasil logout.",
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
                <a
                  className="text-center"
                  href="/dashboard"
                >
                  <p
                    className="m-0"
                    style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
                  >
                    Data Sekolah
                  </p>
                </a>
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
                    <Link className="nav-link" onClick={handleLogout}>
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
            <a
              href="/dashboard"
              className={`logo-navbar text-center${
                isOpen ? " hidden" : ""
              }`}
              style={{
                textDecoration: "none",
              }}
            >
              <p className="m-0" style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
                Data Sekolah
              </p>
            </a>

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
                className="btn-toggle"
                onClick={toggleSidebar}
                aria-expanded={isOpen}
                aria-label="Toggle sidebar"
              >
                {isOpen ? "☰" : "≡"}
              </button>
            ) : (
              <button
                className="btn-toggle"
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
`}
      </style>
    </>
  );
}

export default Sidebar_Navbar;
