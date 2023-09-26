import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EmailVerified() {
  const [text, setText] = useState("");
  const [buttonVisibility, setButtonVisibility] = useState("");
  const { verificationToken } = useParams();
  const handleResendLinkButton = async function (e) {
    e.preventDefault();
    let response = await axios.post("http://localhost:8000/auth/resend-link", {
      verificationToken: verificationToken,
    });
  };

  useEffect(() => {
    async function fetchData() {
      console.log(verificationToken);
      console.log("Lola");
      let response = await axios.post("http://localhost:8000/auth/verify-verification-token", {
        verificationToken: verificationToken,
      });
      if (response.data.error == "Invalid verification token") {
        window.location.replace("http://localhost:3000");
      } else if (response.data.error) {
        setButtonVisibility("block");
        setText(response.data.error);
      } else {
        setButtonVisibility("none");
        setText(response.data.data);
      }
      response = await axios.get(
        "http://localhost:8000/auth/verify-email/" + verificationToken
      );
    }
    fetchData();
  }, []);

  return (
    <div class="flex-grow-1">
      <div className="row">
        <div className="h1 p-4 text-center"> {text}</div>
        <button
          type="button"
          class={
            "btn btn-primary btn-lg col-2 mx-auto fw-bold d-" + buttonVisibility
          }
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={handleResendLinkButton}
        >
          Resend link
        </button>
      </div>
      {/* Modal for successfully resending verification link */}
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
                Resend link successfully!
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Please check your email.</div>
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
export default EmailVerified;
