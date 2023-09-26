import axios from "axios";
import React, { useState } from "react";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [emailErrorClass, setEmailErrorClass] = useState("none");
  const [error, setError] = useState("");
  const [errorClass, setErrorClass] = useState("none");

  const validateEmail = () => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  async function handleRecoverButtonClicked(e) {
    e.preventDefault(); //stops the page from reloading

    if (!validateEmail()) {
      setEmailErrorClass("block");
      return;
    }

    let response = await axios.post(
      "http://localhost:8000/auth/forget-password",
      {
        email: email,
      }
    );
    if (response.data.error) {
      setErrorClass("block");
      setError(response.data.error);
      return;
    } else {
      alert(response.data.data);
    }
  }

  return (
    <div class="flex-grow-1 background-color d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-xl-4 col-lg-6 col-md-8 col-11 my-4 primary-background-color px-lg-5 pb-5">
          <div class="separator my-5 mb-4">
            <h1 className="text-dark fw-light">Account Recovery</h1>
          </div>
          <div className="d-flex mb-2 fs-5">
            Please enter your verified email address to reset your password.
          </div>
          <form onSubmit={handleRecoverButtonClicked}>
            <div class="form-group mb-4">
              <input
                type="text"
                class="form-control"
                id="emailInput"
                placeholder="Email address"
                onInput={(e) => {
                  setEmail(e.target.value);
                }}
                onChange={(e) => {
                  setEmailErrorClass("none");
                }}
              ></input>
              <span class={"text-danger d-" + emailErrorClass}>
                Enter a valid email
              </span>
            </div>
            <div className="d-block">
              <span class={"mb-2 text-danger d-" + errorClass}>{error}</span>
              <button type="submit" class="btn btn-primary w-100 fw-bold">
                Recover
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
