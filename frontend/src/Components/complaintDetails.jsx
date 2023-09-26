import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AsyncSelect from "react-select/async";

function ComplaintDetails() {
  const [complainUNID, setComplainUNID] = useState("");
  const location = useLocation();
  const { id } = useParams();
  const token = localStorage.getItem("userUNID");
  const [complainTitle, setComplainTitle] = useState("");
  const [complainDescription, setComplainDescription] = useState("");
  const [complainAgainst, setComplainAgainst] = useState([]);
  const [lodgerName, setLodgerName] = useState("");
  const [lodgerNsuId, setLodgerNsuId] = useState("");
  const [lodgerEmail, setLodgerEmail] = useState("");
  const [lodgerUserUNID, setLodgerUserUNID] = useState("");
  const [lodgerDesignation, setLodgerDesignation] = useState("");
  const [evidence, setEvidence] = useState([]);
  const [reviewer, setReviewer] = useState("");
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [commentErrorClass, setCommentErrorClass] = useState("none");
  const [isReviewer, setIsReviewer] = useState("");
  const [isOpen, setIsOpen] = useState("");
  const [openCompReviewerMenu, setOpenCompReviewerMenu] = useState(false);

  const [newReviewer, setNewReviewer] = useState("");
  const [newReviewerErrorClass, setNewReviewerErrorClass] = useState("none");

  useEffect(() => {
    async function fetchData() {
      if (!location.state) {
        return window.location.replace("http://localhost:3000");
      }
      let response = await axios.get(
        "http://localhost:8000/home/complain-latest-details",
        {
          params: {
            complainUNID: id,
          },
        }
      );
      
      if (
        !(
          token == response.data.data.ComplainerUNID ||
          token ==
            response.data.data.ComplainReviewers[0].ComplainReviewerUserUNID
        )
      ) {
        window.location.replace("http://localhost:3000");
      }
      response.data.data.status == "Open" ? setIsOpen(true): setIsOpen(false);
      setComplainTitle(response.data.data.complainTitle);
      setComplainDescription(
        response.data.data.ComplainDescriptions[0].complainDescription
      );
      setComplainAgainst(
        response.data.data.ComplainAgainsts.map((e) => ({
          fullName: e.User.fullName,
          userUNID: e.User.userUNID,
        }))
      );
      setLodgerName(response.data.data.User.fullName);
      setLodgerNsuId(response.data.data.User.nsuId);
      setLodgerEmail(response.data.data.User.email);
      setLodgerDesignation(response.data.data.User.userType);
      setLodgerUserUNID(response.data.data.ComplainerUNID);
      setComplainUNID(response.data.data.complainUNID);
      setEvidence(response.data.data.Evidence.map((e) => e.evidence));
      setReviewer(response.data.data.ComplainReviewers[0].User.fullName);
      setCommentList(response.data.data.Comments.map((e) => e.comment));
      if (
        token ==
        response.data.data.ComplainReviewers[0].ComplainReviewerUserUNID
      ) {
        setIsReviewer(true);
      } else {
        setIsReviewer(false);
      }
    }
    fetchData();
  }, []);

  const handleReviewerOnChange = (e) => {
    setOpenCompReviewerMenu(false);
    setNewReviewerErrorClass("none");
    setNewReviewer(e.value);
  };

  const changeReviewerButtonClicked = async (e) => {
    let response = await axios.post(
      "http://localhost:8000/home/change-reviewer",
      {
        complainUNID: id,
        complainReviewerUserUNID: newReviewer,
      }
    );
  };

  const handleOkayButton = () => {
    window.location.replace("http://localhost:3000");
  };

  const handleCloseButton = () => {
    window.location.replace("http://localhost:3000");
  };

  const addCommentButtonClicked = async (e) => {
    e.preventDefault();
    if (!comment) {
      return setCommentErrorClass("block");
    }

    let response = await axios.post("http://localhost:8000/home/add-comment", {
      complainUNID: complainUNID,
      comment: comment,
    });

    if (response.data.data) {
      window.location.reload();
    }
  };

  const fetchReviewerData = async (input, callback) => {
    let response = await axios.get("http://localhost:8000/home/reviewers", {
      params: {
        query: input,
        userUNID: token,
      },
    });
    callback(
      response.data.data.map((i) => ({
        label: i.uniqueDetails,
        value: i.userUNID,
        isDisabled:
          complainAgainst.some((e) =>
            e.userUNID == i.userUNID ? true : false
          ) || (lodgerUserUNID == i.userUNID ? true : false),
      }))
    );
  };

  const handleMarkAsClosedButtonClicked = async () => {
    let response = await axios.post(
      "http://localhost:8000/home/change-status",
      {
        complainUNID: id,
      }
    );
  };

  return (
    <div class="flex-grow-1 background-color d-flex">
      <div className="container-fluid ms-5">
        <div className="row">
          <div class="col-7 my-4 ms-2">
            <div className="row">
              <div className="col-7">
                <h2 className="my-3 d-block">Complaint Details</h2>
              </div>
              <div className="col-5">
                <div
                  className={
                    "justify-content-end " + ((isReviewer && isOpen) ? "d-flex" : "d-none")
                  }
                >
                  <button
                    class="btn btn-primary my-3 me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    Change reviewer
                  </button>
                  <button
                    class="btn btn-primary my-3 ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop3"
                    onClick={handleMarkAsClosedButtonClicked}
                  >
                    Mark as closed
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <div className="d-flex justify-content-between">
                  <div className="h5">Title</div>
                  <div className="h5">:</div>
                </div>
              </div>
              <div className="col-9">
                <h5>{complainTitle}</h5>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <div className="d-flex justify-content-between">
                  <div className="h5">Description</div>
                  <div className="h5">:</div>
                </div>
              </div>
              <div className="col-9">
                <h5>{complainDescription}</h5>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <div className="d-flex justify-content-between">
                  <div className="h5">Complain Against</div>
                  <div className="h5">:</div>
                </div>
              </div>
              <div className="col-9">
                {complainAgainst.length != 0 ? (
                  complainAgainst.map((e) => <h5>{e.fullName}</h5>)
                ) : (
                  <h1></h1>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <div className="d-flex justify-content-between">
                  <div className="h5">Evidence(s)</div>
                  <div className="h5">:</div>
                </div>
              </div>
              <div className="col-9">
                <div className="d-flex flex-column">
                  {evidence.map((src, index) => (
                    <div className="mb-2">
                      <a
                        className="h5"
                        href={"http://localhost:8000/uploads/Evidence/" + src}
                        target="_blank"
                        download={index + 1}
                      >
                        Evidence {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <div className="d-flex justify-content-between">
                  <div className="h5">Complain Reviewer</div>
                  <div className="h5">:</div>
                </div>
              </div>
              <div className="col-9">
                <h5>{reviewer}</h5>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3 mt-2">
                <div className="d-flex justify-content-between">
                  <div className="h5">Comment(s)</div>
                  <div className="h5">:</div>
                </div>
              </div>
              <div className="col-9">
                {commentList.length != 0 ? (
                  commentList.map((e) => {
                    return (
                      <div className="row border border-4 bg-white border-white my-2 ">
                        <h6 class="fw-normal my-1">{e}</h6>
                      </div>
                    );
                  })
                ) : (
                  <h5 class="mt-2">No Comments yet</h5>
                )}
              </div>
            </div>
            <div className={"row mt-3 " + ((isReviewer && isOpen) ? "d-flex" : "d-none")}>
              <div className="col-9 offset-3 p-0">
                <form onSubmit={addCommentButtonClicked}>
                  <div class="form-group mb-4">
                    <textarea
                      class="form-control"
                      id="form4Example3"
                      rows="4"
                      placeholder="Add a comment (upto 150 words)"
                      style={{ resize: "none" }}
                      onInput={(e) => {
                        setComment(e.target.value);
                      }}
                      onChange={(e) => {
                        setCommentErrorClass("none");
                      }}
                    ></textarea>
                    <span class={"text-danger d-" + commentErrorClass}>
                      Add a comment first.
                    </span>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" class={"btn btn-primary fw-bold d-" + (isOpen ? "block" : "none")}>
                      Add new comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-4 my-4 ms-4">
            <div className="d-flex flex-column border border-5 border-white rounded-3 card-shadow p-4">
              <h5 className="text-center mt-3">LODGER DETAILS</h5>
              <div class="d-flex flex-column align-items-center">
                <img
                  src={require("../Assets/User-Profile.png")}
                  alt=""
                  height="150"
                  class="d-inline-block align-text-top mt-1 align-items-center justify-content-center"
                ></img>
              </div>
              <h6 class="mt-3">Name: {lodgerName}</h6>
              <h6 class="mt-3">NSU ID: {lodgerNsuId}</h6>
              <h6 class="mt-3">Email: {lodgerEmail}</h6>
              <h6 class="mt-3">Designation: {lodgerDesignation}</h6>
            </div>
            <div className="d-flex justify-content-end">
              <a
                href={"/view-edit-history/" + id}
                className="btn btn-primary mt-4"
              >
                View Edit History
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Change Reviewer
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <AsyncSelect
                    loadOptions={fetchReviewerData}
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
                  <span class={"text-danger d-" + newReviewerErrorClass}>
                    Select a complain reviewer.
                  </span>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                onClick={changeReviewerButtonClicked}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop2"
              >
                Change Reviewer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdrop2Label"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdrop2Label">
                Reviewer Changed Successfully
              </h5>
            </div>
            <div class="modal-body">Press Okay to continue</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleOkayButton}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade "
        id="staticBackdrop3"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdrop3Label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body">Complain Closed Successfully</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                onClick={handleCloseButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
