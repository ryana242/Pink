import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";

function AdminHomepage() {
  const ref = document.referrer;
  let navigate = useNavigate();
  const [openCompUserMenu, setOpenCompUserMenu] = useState(false);
  const [newModalInput, setNewModalInput] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalPlaceholder, setModalPlaceholder] = useState("");
  const [modalButton, setModalButton] = useState("");
  const [errorClass, setErrorClass] = useState("");
  const [modalErrorText, setModalErrorText] = useState("");
  const [islodging, setIslodging] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!ref) {
        window.location.replace("http://localhost:3000");
      }
    }
    fetchData();
  }, []);

  const handleModalOnChange = (e) => {
    setOpenCompUserMenu(false);
    setErrorClass("none");
    setNewModalInput(e.value);
  };

  const handleModalButtonClicked = async () => {
    if (!newModalInput) {
      setErrorClass("block");
      if (islodging) {
        setModalErrorText("Select complain lodger");
      } else if (isViewing) {
        setModalErrorText("Select an user to view its complaints");
      } else {
        setModalErrorText("Select an account to delete");
      }
      return;
    } else {
      if (islodging) {
        navigate("/lodge-complaint", { state: newModalInput });
        window.location.reload();
      } else if (isViewing) {
         navigate("/admin-view-all-complaints", { state: newModalInput });
         window.location.reload();
      } else {
        let response = await axios.post(
          "http://localhost:8000/admin/delete-account",
          {
            userUNID: newModalInput,
          }
        );
        let myModal = new Modal (document.getElementById("confirmationModal"));
        myModal.show();
      }
    }
  };

  function handleDeleteAccountButtonClicked() {
    setModalTitle("Select User");
    setModalPlaceholder("Choose account to delete");
    setModalButton("Delete Account");
    setIsDeleting(true);
    setIsViewing(false);
    setIslodging(false);
    setErrorClass("none");
  }

  function handleLodgeComplaintButtonClicked() {
    setModalTitle("Select Lodger");
    setModalPlaceholder("Choose lodger");
    setModalButton("Lodge Complaint");
    setIslodging(true);
    setIsDeleting(false);
    setIsViewing(false);
    setErrorClass("none");
  }

  function handleViewAllComplaintButtonClicked() {
    setModalTitle("Select User");
    setModalPlaceholder("Choose User to view all its complaints");
    setModalButton("View Complaints");
    setIsViewing(true);
    setIsDeleting(false);
    setIslodging(false);
    setErrorClass("none");
  }

  const fetchUserData = async (input, callback) => {
    let response = await axios.get("http://localhost:8000/home/all", {
      params: {
        query: input,
      },
    });
    callback(
      response.data.data.map((i) => ({
        label: i.uniqueDetail,
        value: i.userUNID,
      }))
    );
  };

  return (
    <div class="flex-grow-1 d-flex align-items-center">
      <div className="row w-100 justify-content-center">
        <div class="d-grid gap-4 col-4">
          <a
            class="btn admin-button-color btn-lg fw-bold"
            href="http://localhost:3000/register"
            type="button"
          >
            Create Account
          </a>
          <button
            class="btn admin-button-color btn-lg fw-bold"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={handleDeleteAccountButtonClicked}
          >
            Delete Account
          </button>
          <button
            class="btn admin-button-color btn-lg fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            type="button"
            onClick={handleLodgeComplaintButtonClicked}
          >
            Lodge Complaint
          </button>
          <button
            class="btn admin-button-color btn-lg fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            type="button"
            onClick={handleViewAllComplaintButtonClicked}
          >
            View All Complaints
          </button>
        </div>
      </div>

      {/* Modal for searching all type of users*/}
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
                {modalTitle}
              </h5>
              <button
                type="button"
                class="btn-close"
                onClick={(e) => {
                  window.location.reload();
                }}
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <AsyncSelect
                    loadOptions={fetchUserData}
                    placeholder={
                      <div style={{ color: "grey" }}>{modalPlaceholder}</div>
                    }
                    onChange={handleModalOnChange}
                    components={{
                      DropdownIndicator: () => null, // Remove dropdown icon
                      IndicatorSeparator: () => null, // Remove separator
                    }}
                    onBlur={(e) => {
                      setOpenCompUserMenu(false);
                    }}
                    onInputChange={(e, { action }) => {
                      if (e.length === 0) {
                        setOpenCompUserMenu(false);
                        return;
                      }
                      if (action === "input-change") {
                        setOpenCompUserMenu(true);
                      }
                    }}
                    menuIsOpen={openCompUserMenu}
                  />
                  <span class={"text-danger d-" + errorClass}>
                    {modalErrorText}
                  </span>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleModalButtonClicked}
                data-bs-toggle="modal"
                data-bs-target="#confirmationModal"
              >
                {modalButton}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div
        class="modal fade"
        id="confirmationModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="confirmationModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Deletion Successful
              </h5>
              <button
                type="button"
                class="btn-close"
                onClick={(e) => {
                  window.location.reload();
                }}
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
            <h4>
            Account Deleted Successfully
          </h4>
            </div>
            <div class="modal-footer">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminHomepage;
