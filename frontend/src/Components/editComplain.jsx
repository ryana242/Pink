import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useParams } from "react-router-dom";

function EditComplaint() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [openCompAgainstMenu, setOpenCompAgainstMenu] = useState(false);
  const [openCompReviewerMenu, setOpenCompReviewerMenu] = useState(false);
  const [complainTitle, setComplainTitle] = useState("");
  const [complainDescription, setComplainDescription] = useState("");
  const [complainAgainst, setComplainAgainst] = useState([]);
  const [reviewer, setReviewer] = useState("");
  const [complainDescriptionErrorClass, setComplainDescriptionErrorClass] =
    useState("none");
  const [complainAgainstErrorClass, setComplainAgainstErrorClass] =
    useState("none");
  const [evidenceErrorClass, setEvidenceErrorClass] = useState("none");
  const token = localStorage.getItem("userUNID");
  const { id } = useParams();

  const [complainAgainstOptions, setComplainAgainstOptions] = useState([]);
  const [reviewerOption, setReviewerOption] = useState({});
  const [oldEvidence, setOldEvidence] = useState([]);
  const max = 250;

  if (!token) {
    window.location.replace("http://localhost:3000/login");
  }

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(
        "http://localhost:8000/home/complain-latest-details",
        {
          params: {
            complainUNID: id,
          },
        }
      );
      if (token != response.data.data.ComplainerUNID) {
        window.location.replace("http://localhost:3000");
      }
      if (response.data.error || response.data.data == null) {
        window.location.replace("http://localhost:3000");
      }
      setComplainTitle(response.data.data.complainTitle);
      setComplainDescription(
        response.data.data.ComplainDescriptions[0].complainDescription
      );
      let temp = {
        label: response.data.data.ComplainReviewers[0].User.uniqueDetail,
        value: response.data.data.ComplainReviewers[0].User.userUNID,
      };
      const temp1 = response.data.data.ComplainAgainsts.map((e) => ({
        label: e.User.uniqueDetail,
        value: e.User.userUNID,
      }));
      const temp2 = response.data.data.ComplainAgainsts.map(
        (e) => e.User.userUNID
      );
      setComplainAgainst(temp2);
      setComplainAgainstOptions(temp1);
      setReviewerOption(temp);
      setReviewer(response.data.data.ComplainReviewers[0].User.userUNID);
      setOldEvidence(response.data.data.Evidence.map((e) => e.evidence));
    }
    fetchData();
  }, []);

  const updateList = function (e) {
    e.preventDefault();
    const newFiles = selectedFiles.slice();
    for (let i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i]);
    }
    if (newFiles.length > 0) {
      setIsFilePicked(true);
      setEvidenceErrorClass("none");
    }
    setSelectedFiles(newFiles);
    e.target.value = "";
  };

  const handleCrossButton = function (e, index) {
    e.preventDefault();
    console.log(index);
    const newFiles = selectedFiles.slice();
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    console.log(newFiles);
  };

  const handleComplainAgainstOnChange = (e) => {
    setOpenCompAgainstMenu(false);
    setComplainAgainstErrorClass("none");
    const temp = [];
    for (let i = 0; i < e.length; i++) {
      temp.push(e[i].value);
    }
    setComplainAgainstOptions(e);
    setComplainAgainst(temp);
  };

  const handleReviewerOnChange = (e) => {
    setOpenCompReviewerMenu(false);
    setReviewer(e.value);
  };

  const fetchComplainAgainstData = async (input, callback) => {
    let response = await axios.get(
      "http://localhost:8000/home/complain-against",
      {
        params: {
          query: input,
          userUNID: token,
        },
      }
    );
    callback(
      response.data.data.map((i) => ({
        label: i.uniqueDetail,
        value: i.userUNID,
        isDisabled: reviewer == i.userUNID ? true : false,
      }))
    );
  };

  const fetchReviewerData = async (input, callback) => {
    let response = await axios.get("http://localhost:8000/home/reviewers", {
      params: {
        query: input,
        userUNID: token,
      },
    });
    console.log(response);
    callback(
      response.data.data.map((i) => ({
        label: i.uniqueDetail,
        value: i.userUNID,
        isDisabled: complainAgainst.some((e) =>
          e == i.userUNID ? true : false
        ),
      }))
    );
  };

  async function handleLodgeComplaintButtonClicked(e) {
    e.preventDefault();
    console.log(complainAgainst);
    if (!complainDescription || complainDescription.length > max) {
      return setComplainDescriptionErrorClass("block");
    }
    if (complainAgainst.length === 0) {
      return setComplainAgainstErrorClass("block");
    }

    const formData = new FormData();
    formData.append("complainUNID", id);
    formData.append("complainerUNID", token);
    formData.append("complainTitle", complainTitle);
    formData.append("complainDescription", complainDescription);
    formData.append("complainAgainstUserUNID", JSON.stringify(complainAgainst));
    formData.append("complainReviewerUserUNID", reviewer);
    formData.append("oldEvidenceCount", oldEvidence.length);
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    let response = await axios.post(
      "http://localhost:8000/home/edit-complain",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(response);
    if (response.data.data) {
      let myModal = new Modal(document.getElementById("exampleModal"));
      myModal.show();
    }
  }

  return (
    <div class="flex-grow-1 background-color d-flex align-items-center justify-content-center">
      <div class="row justify-content-center w-100">
        <div class="col-xl-5 col-lg-7 col-md-9 col-11 my-4 primary-background-color px-lg-5 pb-5">
          <div class="separator my-5 ">
            <h1 className="text-dark fw-light">Edit Complaint</h1>
          </div>
          <form onSubmit={handleLodgeComplaintButtonClicked}>
            <div class="form-group mb-4">
              <input
                disabled
                value={complainTitle}
                type="text"
                class="form-control"
                id="emailInput"
                placeholder="Complain Title"
                onInput={(e) => {
                  setComplainTitle(e.target.value);
                }}
              ></input>
            </div>
            <div class="form-group mb-4">
              <textarea
                value={complainDescription}
                class="form-control"
                id="form4Example3"
                rows="6"
                placeholder="Complain Description (upto 150 words)"
                style={{ resize: "none" }}
                onInput={(e) => {
                  setComplainDescription(e.target.value);
                }}
                onChange={(e) => {
                  setComplainDescriptionErrorClass("none");
                }}
              ></textarea>
              <span class={"text-danger d-" + complainDescriptionErrorClass}>
                Enter Complaint Description within 250 words.
              </span>
            </div>
            <div className="form-group d-flex flex-column mb-4">
              <div className="col-12">
                <AsyncSelect
                  loadOptions={fetchComplainAgainstData}
                  value={complainAgainstOptions}
                  placeholder={
                    <div style={{ color: "grey" }}>Complain Against</div>
                  }
                  components={{
                    DropdownIndicator: () => null, // Remove dropdown icon
                    IndicatorSeparator: () => null, // Remove separator
                  }}
                  isMulti
                  defaultValue={complainAgainst}
                  onChange={handleComplainAgainstOnChange}
                  onBlur={(e) => {
                    setOpenCompAgainstMenu(false);
                  }}
                  onInputChange={(e, { action }) => {
                    if (e.length === 0) {
                      setOpenCompAgainstMenu(false);
                      return;
                    }
                    if (action === "input-change") {
                      setOpenCompAgainstMenu(true);
                    }
                  }}
                  menuIsOpen={openCompAgainstMenu}
                />
                <span class={"text-danger d-" + complainAgainstErrorClass}>
                  Select user(s) to complain against.
                </span>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="mb-2">Old Evidence(s)</div>
              {oldEvidence.map((src, index) => (
                <div className="mb-2">
                  <a
                    className="h6 fw-normal"
                    href={"http://localhost:8000/uploads/Evidence/" + src}
                    target="_blank"
                    download={index + 1}
                  >
                    Evidence {index + 1}
                  </a>
                </div>
              ))}
            </div>
            <div class="form-group mb-4">
              <label
                class="button-attach ms-0"
                for="file"
                style={{ width: "40%" }}
              >
                <i class="bi bi-paperclip me-1"></i>
                Add new evidence
              </label>
              <input
                accept="image/*, application/pdf, video/*"
                id="file"
                type="file"
                name="file"
                multiple
                onChange={updateList}
              ></input>
              {isFilePicked ? (
                <div id="fileList">
                  <ul class="py-2 mb-0">
                    {selectedFiles.map((k, index) => (
                      <li class="d-flex justify-content-between align-items-center border rounded-3 border-3 border-light bg-white mt-2 ps-2">
                        {k.name}
                        <button
                          class="btn btn-light"
                          onClick={(e) => handleCrossButton(e, index)}
                        >
                          {" "}
                          x{" "}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p class="d-none">Select a file to show details</p>
              )}
              <span class={"mb-2 text-danger d-" + evidenceErrorClass}>
                Please attach evidence(s)
              </span>
            </div>
            <div className="form-group d-flex flex-column mb-4">
              <div className="col-12">
                <AsyncSelect
                  loadOptions={fetchReviewerData}
                  isDisabled
                  value={reviewerOption}
                  placeholder={
                    <div style={{ color: "grey" }}>
                      Choose Reviewer(only one)
                    </div>
                  }
                  components={{
                    DropdownIndicator: () => null, // Remove dropdown icon
                    IndicatorSeparator: () => null, // Remove separator
                  }}
                  onChange={handleReviewerOnChange}
                  onBlur={(e) => {
                    setOpenCompReviewerMenu(false);
                  }}
                  onInputChange={(e, { action }) => {
                    if (e.length === 0) {
                      setOpenCompReviewerMenu(false);
                      return;
                    }
                    if (action === "input-change") {
                      setOpenCompReviewerMenu(true);
                    }
                  }}
                  menuIsOpen={openCompReviewerMenu}
                />
              </div>
            </div>
            <div className="d-block">
              <button type="submit" class="btn btn-primary w-100 fw-bold">
                Edit Complaint
              </button>
            </div>
          </form>
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
                    Complaint Edited Successfully!
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">Click OK to continue</div>
                <div class="modal-footer">
                  <a className="btn btn-primary" href="/">
                    OK
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditComplaint;
