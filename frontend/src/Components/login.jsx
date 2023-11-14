import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";

function Login() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailErrorClass, setEmailErrorClass] = useState("none");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorClass, setErrorClass] = useState("none");
  const token = localStorage.getItem("userUNID");
  const clientId =
    "992655217366-qiu0iegl7kmotoovl1630k6283o0jsuk.apps.googleusercontent.com";

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
          window.location.replace("http://localhost:3000");
        }
      }
    }
    fetchData();
  }, []);

  if (token) {
    window.location.replace("http://localhost:3000");
  }

  const validateEmail = () => {
    return (
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) && email.length <= 320
    );
  };

  async function handleLoginButtonClicked(e) {
    e.preventDefault(); //Stops the page from loading

    if (!validateEmail()) {
      setEmailErrorClass("block");
      return;
    }

    let response = await axios.post("http://localhost:8000/auth/login", {
      email: email,
      password: password,
    });

    if (response.data.error) {
      setErrorClass("block");
      setError(response.data.error);
      return;
    } else {
      localStorage.setItem("userUNID", response.data.data.userUNID);
      window.location.replace("http://localhost:3000");
    }
  }

  async function onLoginSuccess(res) {
    let response = await axios.post(
      "http://localhost:8000/auth/google-accounts",
      {
        googleID: res.getAuthResponse().id_token,
      }
    );

    if (response.data.data) {
      console.log(response);
      localStorage.setItem("userUNID", response.data.data.UserUNID);
      window.location.replace("http://localhost:3000");
    } else {
      if (response.data.error == "Account not found. Please contact admin.") {
        setError(response.data.error);
        setErrorClass("block");
      } else {
        res.profileObj.googleID = res.getAuthResponse().id_token;
        navigate("/google-registration", { state: res.profileObj });
      }
    }
  }

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };

  return (
    <div class="flex-grow-1 background-color d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-xl-4 col-lg-6 col-md-8 col-11 my-4 primary-background-color px-lg-5 pb-5">
          <div class="separator my-5 ">
            <h1 className="text-dark fw-light">Login</h1>
          </div>
          <form onSubmit={handleLoginButtonClicked}>
            <div class="form-group mb-4">
              <input
                type="text"
                class="form-control"
                id="emailInput"
                placeholder="Email"
                onInput={(e) => setEmail(e.target.value)}
                onChange={(e) => {
                  setEmailErrorClass("none");
                  setErrorClass("none");
                }}
              ></input>
              <span class={"text-danger d-" + emailErrorClass}>
                Enter a valid Email
              </span>
            </div>
            <div class="form-group mb-4">
              <input
                type="password"
                class="form-control"
                id="passwordInput"
                placeholder="Password"
                onInput={(e) => setPassword(e.target.value)}
                onChange={(e) => setErrorClass("none")}
              ></input>
            </div>
            <div className="d-block">
              <span class={"mb-2 text-danger d-" + errorClass}>{error}</span>
              <button type="submit" class="btn btn-primary w-100 fw-bold">
                Login
              </button>
              <div className="d-flex mt-3 justify-content-end fw-bold text-primary">
                <a href="/forget-password" className="text-decoration-none">
                  Forgot Password?
                </a>
              </div>
            </div>
          </form>
          <hr class="my-4" />
          <div className="d-flex justify-content-center">
            <GoogleLogin
              clientId={clientId}
              buttonText="Google SignIn"
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              cookiePolicy={"single_host_origin"}
              className="border border-2 border-dark rounded-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
