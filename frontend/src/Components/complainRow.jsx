import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ComplainRow(props) {
  let navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      //is this console required?
      // console.log(props.complain);
      // console.log(props.complain.Comments.length);
    }
    fetchData();
  }, []);

  const complainDetailsClicked = () => {
    navigate("/complaint-details/" + props.complain.complainUNID, {
      state: props.complain.complainerUNID,
    });
  };

  return (
    <>
      <div className="row">
        <div class="card border border-4 background-color rounded-3 border-white m-2 card-shadow">
          <div class="card-body">
            <h3 class="card-title">{props.complain.complainTitle}</h3>
            <h5 class="card-text mt-4 mb-3 text-danger">
              Latest Comment:{" "}
              {props.complain.Comments.length == 1
                ? props.complain.Comments[0].comment
                : "No comments yet"}
            </h5>
            <div className="d-flex justify-content-between">
              <h5 class="card-text">
                Complain Status: {props.complain.status}
              </h5>
              <div>
                <a
                  class="btn btn-primary me-2"
                  onClick={complainDetailsClicked}
                >
                  Check details
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/edit-complaint/" + props.complain.complainUNID;
                  }}
                  class="btn btn-primary"
                  disabled={props.complain.status == "Open" ? false : true}
                >
                  Edit Complain
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComplainRow;
