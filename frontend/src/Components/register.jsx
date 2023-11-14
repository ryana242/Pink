import axios from "axios";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Modal } from "bootstrap";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";

function Register() {
  let navigate = useNavigate();
  let ref = document.referrer;
  const [fullName, setFullName] = useState("");
  const [duId, setDuId] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameErrorClass, setNameErrorClass] = useState("none");
  const [duIdErrorClass, setDuIdErrorClass] = useState("none");
  const [emailErrorClass, setEmailErrorClass] = useState("none");
  const [designationErrorClass, setDesignationErrorClass] = useState("none");
  const [passwordErrorClass, setPasswordErrorClass] = useState("none");
  const [confirmPassErrorClass, setConfirmPassErrorClass] = useState("none");
  const [error, setError] = useState("");
  const [errorClass, setErrorClass] = useState("none");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [idPhotoErrorClass, setIdPhotoErrorClass] = useState("none");
  const [Designations, setDesignations] = useState([
    { label: "Faculty", value: 1, isDisabled: true },
    { label: "Student", value: 2, isDisabled: true },
    {
      label: "Lab Instructor",
      value: 3,
      isDisabled: true,
    },
    { label: "Helper", value: 4, isDisabled: true },
    { label: "Admin", value: 5, isDisabled: true },
  ]);

  const token = localStorage.getItem("userUNID");
  const clientId =
    "992655217366-qiu0iegl7kmotoovl1630k6283o0jsuk.apps.googleusercontent.com";

  const validateEmail = () => {
    return (
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) && email.length <= 320
    );
  };

  useEffect(() => {
    async function fetchData() {
      console.log(ref);
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

  async function handleSubmit(e) {
    e.preventDefault(); //stops the page from reloading

    if (fullName.length < 3 || fullName.length > 30) {
      setNameErrorClass("block");
      return;
    }

    /*if (duId.length != 10) {
      setDuIdErrorClass("block");
      return;
    }*/

    if (!validateEmail()) {
      setEmailErrorClass("block");
      return;
    }

    if (designation.length === 0) {
      setDesignationErrorClass("block");
      return;
    }

    if (password.length < 6 || password.length > 30) {
      setPasswordErrorClass("block");
      return;
    }

    if (confirmPassword != password) {
      setConfirmPassErrorClass("block");
      return;
    }

    if (!isFilePicked) {
      return setIdPhotoErrorClass("block");
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("duId", duId);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("userType", designation);
    formData.append("file", selectedFiles);

    let response;
    if(ref != "http://localhost:3000/admin-homepage") {
      response = await axios.post(
        "http://localhost:8000/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      response = await axios.post(
        "http://localhost:8000/admin/create-account",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }
    
    if (response.data.error) {
      setErrorClass("block");
      setError(response.data.error);
      return;
    } else {
      let myModal = new Modal(document.getElementById("exampleModal"));
      myModal.show();
    }
  }

  const updateList = function (e) {
    e.preventDefault();
    const newFiles = e.target.files[0];
    if (newFiles) {
      setIsFilePicked(true);
      setIdPhotoErrorClass("none");
    }
    setSelectedFiles(newFiles);
    e.target.value = "";
  };

  const handleCrossButton = function (e) {
    e.preventDefault();
    setSelectedFiles({});
    setIsFilePicked(false);
  };

  if (token) {
    window.location.replace("http://localhost:3000");
  }

  async function onLoginSuccess(res) {
    let response = await axios.post(
      "http://localhost:8000/auth/google-accounts",
      {
        googleID: res.getAuthResponse().id_token,
      }
    );
    if (response.data.data) {
      localStorage.setItem("userUNID", response.data.data.UserUNID);
      window.location.replace("http://localhost:3000");
    } else {
      res.profileObj.googleID = res.getAuthResponse().id_token;
      console.log(res.profileObj);
      navigate("/google-registration", { state: res.profileObj });
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
            <h1 className="text-dark fw-light">Register</h1>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div class="form-group mb-4">
              <input
                onInput={(e) => {
                  setFullName(e.target.value);
                }}
                onChange={(e) => {
                  setNameErrorClass("none");
                }}
                type="text"
                class="form-control"
                id="fullNameInput"
                placeholder="Full Name"
              ></input>
              <span class={"text-danger d-" + nameErrorClass}>
                Full Name can't be less than 3 characters or more than 30
                characters
              </span>
            </div>
            <div class="form-group mb-4">
              <input
                onInput={(e) => {
                  setDuId(e.target.value);
                }}
                onChange={(e) => {
                  setDuIdErrorClass("none");
                }}
                type="text"
                class="form-control"
                id="duIdInput"
                placeholder="Registration number"
              ></input>
              <span class={"text-danger d-" + duIdErrorClass}>
                Enter a valid Registration Number
              </span>
            </div>
            <div class="form-group mb-4">
              <input
                onInput={(e) => {
                  setEmail(e.target.value);
                }}
                onChange={(e) => {
                  setEmailErrorClass("none");
                  setDesignation("");
                }}
                /*onBlur={(e) => {
                  if (
                    //email.length > 13 &&
                    //email.substring(email.length - 14) === "du.ac.bd"
                  ) {
                    setDesignations([
                      { label: "Faculty", value: 1, isDisabled: false },
                      { label: "Student", value: 2, isDisabled: false },
                      {
                        label: "Lab Instructor",
                        value: 3,
                        isDisabled: false,
                      },
                      { label: "Helper", value: 4, isDisabled: true },
                      { label: "Admin", value: 5, isDisabled: false },
                    ]);
                  } else if (validateEmail(email)) {
                    setDesignations([
                      { label: "Faculty", value: 1, isDisabled: true },
                      { label: "Student", value: 2, isDisabled: true },
                      {
                        label: "Lab Instructor",
                        value: 3,
                        isDisabled: true,
                      },
                      { label: "Helper", value: 4, isDisabled: false },
                      { label: "Admin", value: 5, isDisabled: true },
                    ]);
                  }
                }}*/
                onBlur={(e) => {
                  if (validateEmail(email)) {
                    setDesignations([
                      { label: "Faculty", value: 1, isDisabled: false },
                      { label: "Student", value: 2, isDisabled: false },
                      {
                        label: "Lab Instructor",
                        value: 3,
                        isDisabled: false,
                      },
                      { label: "Helper", value: 4, isDisabled: false },
                      { label: "Admin", value: 5, isDisabled: false },
                    ]);
                  }
                }} 
                type="text"
                class="form-control"
                id="emailInput"
                placeholder="Email"
              ></input>
              <span class={"text-danger d-" + emailErrorClass}>
                Enter a valid email
              </span>
            </div>
            <div className="form-group d-flex flex-column mb-4">
              <div className="col-12">
                <Select
                  options={Designations}
                  value={designation ? { label: designation } : ""}
                  placeholder={<div style={{ color: "grey" }}>Designation</div>}
                  onChange={(e) => {
                    console.log(e);
                    setDesignation(e.label);
                    setDesignationErrorClass("none");
                  }}
                />
              </div>
              <span class={"text-danger d-" + designationErrorClass}>
                Please select your designation
              </span>
            </div>
            <div class="form-group mb-4 d-flex">
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
                placeholder="Password"
              ></input>
              <span class={"text-danger d-" + passwordErrorClass}>
                Password can't be less than 6 characters or more than 30
                characters
              </span>
            </div>
            <div class="form-group mb-4 d-flex">
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
            <div class="form-group mb-4">
              <label class="button-attach ms-0" for="file">
                <i class="bi bi-paperclip me-1"></i>
                ID card Photo
              </label>
              <input
                accept="image/*"
                id="file"
                type="file"
                name="file"
                onChange={updateList}
              ></input>
              {isFilePicked ? (
                <div id="fileList">
                  <ul class="py-2 mb-0">
                    <li class="d-flex justify-content-between align-items-center border rounded-3 border-3 border-light bg-white mt-2 ps-2">
                      {selectedFiles.name}
                      <button
                        class="btn btn-light"
                        onClick={(e) => handleCrossButton(e)}
                      >
                        {" "}
                        x{" "}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <p class="d-none">Select a file to show details</p>
              )}
              <span class={"mb-2 text-danger d-" + idPhotoErrorClass}>
                Please attach your DU ID card photo
              </span>
            </div>
            <div className="d-block">
              <span class={"mb-2 text-danger d-" + errorClass}>{error}</span>
              <button type="submit" class="btn btn-primary w-100 fw-bold">
                Register
              </button>
            </div>
          </form>
          <div className={ref == "http://localhost:3000/admin-homepage" ? "d-none" : "d-block"}>
          <hr class="my-4" />
          <div className="d-flex justify-content-center">
            
            <GoogleLogin
              clientId={clientId}
              buttonText="Google Signup"
              onSuccess={onLoginSuccess}
              onFailure={onLoginFailure}
              cookiePolicy={"single_host_origin"}
              className="border border-2 border-dark rounded-2"
            />
          </div>

          </div>
          
          {/* Modal for successful Registration */}
          <div
            class="modal fade"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Registration Successful! You may log in now!
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
