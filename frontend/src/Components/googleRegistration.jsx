import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Modal } from "bootstrap";

function GoogleRegistration(props) {
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [nsuId, setNsuId] = useState("");
  const [nsuIdErrorClass, setNsuIdErrorClass] = useState("none");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationErrorClass, setDesignationErrorClass] = useState("none");
  const [error, setError] = useState("");
  const [errorClass, setErrorClass] = useState("none");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [idPhotoErrorClass, setIdPhotoErrorClass] = useState("none");
  const [isNsuSignUp, setIsNsuSignUp] = useState(false);
  const [Designations, setDesignations] = useState([
    { label: "Faculty", value: 1, isDisabled: true },
    { label: "Student", value: 2, isDisabled: true },
    {
      label: "RA / TA / Lab Instructor",
      value: 3,
      isDisabled: true,
    },
    { label: "Helper", value: 4, isDisabled: true },
    { label: "Admin", value: 5, isDisabled: true },
  ]);

  useEffect(() => {
    async function fetchData() {
      if (location.state == null) {
        window.location.replace("http://localhost:3000");
      }
      console.log(location.state);

      if (location.state.email.includes("northsouth.edu")) {
        setIsNsuSignUp(true);
        setFullName(location.state.givenName);
        setNsuId(location.state.familyName);
        setEmail(location.state.email);
        setDesignation("");
        setDesignations([
          { label: "Faculty", value: 1, isDisabled: false },
          { label: "Student", value: 2, isDisabled: false },
          {
            label: "RA / TA / Lab Instructor",
            value: 3,
            isDisabled: false,
          },
          { label: "Helper", value: 4, isDisabled: true },
          { label: "Admin", value: 5, isDisabled: false },
        ]);
      } else {
        setIsNsuSignUp(false);
        setNsuId("");
        setFullName(location.state.name);
        setEmail(location.state.email);
        setDesignation("Helper");
        setDesignations([
          { label: "Faculty", value: 1, isDisabled: true },
          { label: "Student", value: 2, isDisabled: true },
          {
            label: "RA / TA / Lab Instructor",
            value: 3,
            isDisabled: true,
          },
          { label: "Helper", value: 4, isDisabled: false },
          { label: "Admin", value: 5, isDisabled: true },
        ]);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault(); //stops the page from reloading

    if (nsuId.length != 10) {
      setNsuIdErrorClass("block");
      return;
    }
    if (designation.length === 0) {
      setDesignationErrorClass("block");
      return;
    }
    if (!isFilePicked) {
      return setIdPhotoErrorClass("block");
    }

    const formData = new FormData();
    console.log(location.state.googleID);
    formData.append("fullName", fullName);
    formData.append("nsuId", nsuId);
    formData.append("email", email);
    formData.append("googleID", location.state.googleID);
    formData.append("userType", designation);
    formData.append("file", selectedFiles);

    let response = await axios.post(
      "http://localhost:8000/auth/register/google",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log(response);

    if (response.data.error) {
      setErrorClass("block");
      setError(response.data.error);
      return;
    } else {
      console.log(response);
      let myModal = new Modal(document.getElementById("exampleModal"));
      myModal.show();
    }
  }

  const updateList = function (e) {
    e.preventDefault();
    const newFiles = e.target.files[0];
    console.log(newFiles);
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
                disabled={true}
                value={fullName}
                type="text"
                class="form-control"
                id="fullNameInput"
                placeholder="Full Name"
              ></input>
            </div>
            <div class="form-group mb-4">
              <input
                disabled={isNsuSignUp}
                value={nsuId}
                onInput={(e) => {
                  setNsuId(e.target.value);
                }}
                onChange={(e) => {
                  setNsuIdErrorClass("none");
                }}
                type="text"
                class="form-control"
                id="nsuIdInput"
                placeholder="NSU ID"
              ></input>
              <span class={"text-danger d-" + nsuIdErrorClass}>
                Enter a valid NSU ID
              </span>
            </div>
            <div class="form-group mb-4">
              <input
                disabled={true}
                value={email}
                type="text"
                class="form-control"
                id="emailInput"
                placeholder="Email"
              ></input>
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
                Please attach your NSU ID card photo
              </span>
            </div>
            <div className="d-block">
              <span class={"mb-2 text-danger d-" + errorClass}>{error}</span>
              <button type="submit" class="btn btn-primary w-100 fw-bold">
                Register
              </button>
            </div>
          </form>
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
                Registration Successful!
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Account Registration Successfull</div>
            <div class="modal-footer">
              <a className="btn btn-primary" href="/login">
                Ok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleRegistration;
