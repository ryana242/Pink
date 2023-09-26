import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ReviewComplainRow(props) {
  let navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      console.log(props.complain);
    }
    fetchData();
  }, []);

  const complainDetailsClicked = () => {
    navigate("/complaint-details/" + props.complain.complainUNID, {
      state: props.complain.Complain.User.userUNID,
    });
  };
  return (
    <>
      <div className="row">
        <div class="card border border-4 background-color rounded-3 border-white m-2 card-shadow">
          <div class="card-body">
            <h3 class="card-title">{props.complain.Complain.complainTitle}</h3>
            <h5 class="card-text mt-4 mb-3 text-danger">
              Complainer: {props.complain.Complain.User.fullName}
            </h5>
            <div className="d-flex justify-content-between">
              <h5 class="card-text">
                Complain Status: {props.complain.Complain.status}
              </h5>
              <div>
                <a
                  class="btn btn-primary me-2"
                  onClick={complainDetailsClicked}
                >
                  Check details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewComplainRow;
