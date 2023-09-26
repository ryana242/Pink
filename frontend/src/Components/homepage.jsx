import React, { useState } from "react";

function Homepage() {
  return (
    <div class="flex-grow-1">
      <div className="container-fluid">
        <div className="row home-page-title-color py-5">
          <div className="col-5 offset-2">
            <div className="display-5 my-2">Submit a complaint</div>
            <p class="fs-5 mt-3">
              Welcome to the Pink, a  platform for complaint lodging and  management for department of Computer Science and Engineering, University of Dhaka.
              Anyone affiliated with the department can
              lodge complaints. The complaints are sent to reviewers,
              who then review the complaints and take necessary actions to resolve the issue. 
            </p>
          </div>
          <div className="col-2">
            <img
              src={require("../Assets/homepage-title-photo.png")}
              class="mt-4"
              style={{
                width: "450px",
                maxHeight: "450px",
              }}
            ></img>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col-8 offset-2 h4 fw-normal">
            Frequently Asked Questions
          </div>
        </div>
        <div className="row">
          <div className="col-5 offset-2">
            <div class="accordion accordion-flush" id="accordionFlushExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOne">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    Can I lodge an anonymous complaint?
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  class="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body">
                    No. You must register before lodging your first complaint
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingFour">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseFour"
                    aria-expanded="false"
                    aria-controls="flush-collapseFour"
                  >
                    How to lodge a complaint?
                  </button>
                </h2>
                <div
                  id="flush-collapseFour"
                  class="accordion-collapse collapse"
                  aria-labelledby="flush-headingFour"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body">
                    Once you are logged in, you can click on the "Lodge Complaint" button on the dashboard and fill out the details of the complaint. In addition, the system admin can lodge a complaint on behalf of you.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingTwo">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    How do you process the complaints?
                  </button>
                </h2>
                <div
                  id="flush-collapseTwo"
                  class="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwo"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body">
                    The complaint is first lodged by a lodger. Each complaint has a reviewer who reviews all the details. The reviewer can close a complaint once all the necessary steps to resolve the issue are taken.
                  </div>
                </div>
              </div>
              <div class="accordion-item mb-3">
                <h2 class="accordion-header" id="flush-headingThree">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    aria-expanded="false"
                    aria-controls="flush-collapseThree"
                  >
                    Is there a mobile app version of Pink?
                  </button>
                </h2>
                <div
                  id="flush-collapseThree"
                  class="accordion-collapse collapse"
                  aria-labelledby="flush-headingThree"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body">
                    We are currently working on it.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
