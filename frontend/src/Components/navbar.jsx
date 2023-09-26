import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Navbar() {
  const token = localStorage.getItem("userUNID");
  const [register, setRegister] = useState("none");
  const [dashboard, setDashboard] = useState("none");

  useEffect(() => {
    async function fetchData() {
      if (token) {
        let response = await axios.post(
          "http://localhost:8000/auth/verify-unid",
          {
            UNID: token,
          }
        );
        if (response.data.error) {
          localStorage.clear();
          setRegister("block");
        } else {
          setDashboard("block");
        }
      } else {
        setRegister("block");
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <nav class="navbar navbar-expand-lg primary-color">
        <div class="container-fluid">
          <a class="navbar-brand ms-5" href="/">
            <img
              src={require("../Assets/logo.png")}
              alt=""
              height="100"
              class="d-inline-block align-text-top"
            ></img>
          </a>
          <button
            class="navbar-toggler border border-dark"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon d-flex justify-content-center align-items-center">
              <FontAwesomeIcon icon={faBars} />
            </span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className="btn btn-lg navbar-button-color my-2 ms-4 ms-lg-0 me-5"
                  href="/lodge-complaint"
                >
                  Lodge Complaint
                </a>
              </li>
              <li className="nav-item me-2">
                <a
                  className={
                    "btn btn-lg navbar-button-color my-2 ms-4 me-2 d-" +
                    register
                  }
                  href="/register"
                >
                  Register
                </a>
              </li>
              <li>
                <a
                  className={
                    "btn btn-lg navbar-button-color my-2 ms-4 ms-lg-0 me-5 d-" +
                    register
                  }
                  href="/login"
                >
                  Login
                </a>
              </li>
              <li className="nav-item me-2">
                <a
                  className={
                    "btn btn-lg navbar-button-color my-2 ms-4 ms-lg-0 me-5 d-" +
                    dashboard
                  }
                  href="/dashboard"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
