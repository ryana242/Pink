import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrorClass, setPasswordErrorClass] = useState("none");
  const [confirmPassErrorClass, setConfirmPassErrorClass] = useState("none");

  useEffect(() => {
    async function fetchData() {
      let response = await axios.post(
        "http://localhost:8000/auth/verify-default-user",
        {
          UNID: id,
        }
      );

      if (response.data.error) {
        window.location.replace("http://localhost:3000");
      }
    }
    fetchData();
  }, []);

  async function handleUpdateButton(e) {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordErrorClass("block");
      return;
    }

    if (confirmPassword != password) {
      setConfirmPassErrorClass("block");
      return;
    }

    let response = await axios.post(
      "http://localhost:8000/auth/password-update",
      {
        UNID: id,
        password: password,
      }
    );
    alert(response.data.data);
  }

  return (
    <div class="flex-grow-1 background-color d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-xl-4 col-lg-6 col-md-8 col-11 my-4 primary-background-color px-lg-5 pb-5">
          <div class="separator my-5 mb-4">
            <h1 className="text-dark fw-light">Reset your password</h1>
          </div>
          <form onSubmit={handleUpdateButton}>
            <div class="form-group mb-4">
              <input
                onInput={(e) => {
                  setPassword(e.target.value);
                }}
                onChange={(e) => {
                  setPasswordErrorClass("none");
                }}
                type="password"
                class="form-control"
                id="passwordInput"
                placeholder="New Password"
              ></input>
              <span class={"text-danger d-" + passwordErrorClass}>
                Password can't be less than 6 characters
              </span>
            </div>
            <div class="form-group mb-4">
              <input
                onInput={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                onChange={(e) => {
                  setConfirmPassErrorClass("none");
                }}
                type="password"
                class="form-control"
                id="confirmPasswordInput"
                placeholder="Confirm Password"
              ></input>
              <span class={"text-danger d-" + confirmPassErrorClass}>
                Password doesn't match
              </span>
            </div>
            <div className="d-block">
              <button type="submit" class="btn btn-primary w-100 fw-bold">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;



