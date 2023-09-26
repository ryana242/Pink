import React, { useState, useEffect } from "react";
import axios from "axios";
import ComplainRow from "./complainRow";
import ReviewComplainRow from "./reviewComplainRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUserLock } from "@fortawesome/free-solid-svg-icons";
import AdminComplainRow from "./adminComplainRow";
import { useLocation, useNavigate } from "react-router-dom";

function AdminViewAllCom() {
    const ref = document.referrer;
    let navigate = useNavigate();
    const location = useLocation();

const token = location.state;
  const [name, setName] = useState("");
  const [nsuId, setNsuId] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [complainList, setComplainList] = useState([]);
  const [reviewComplainList, setReviewComplainList] = useState([]);
  const [reviewedComplainList, setReviewedComplainList] = useState([]);
  const [myComplainsSelectedClass, setMyComplainSelectedClass] = useState(
    "btn-light card-shadow"
  );
  const [reviewComplainSelectedClass, setReviewComplainSelectedClass] =
    useState("");
  const [reviewedComplainSelectedClass, setReviewedComplainSelectedClass] =
    useState("");

  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    async function fetchData() {
      console.log(token);
      if (!token || !ref) {
        console.log("aise");
        window.location.replace("http://localhost:3000");
        return;
      }
      let response = await axios.get(
        "http://localhost:8000/home/user-details",
        {
          params: {
            userUNID: token,
          },
        }
      );
      let openComplain = [];
      let closeComplain = [];
      setName(response.data.data.fullName);
      setNsuId(response.data.data.nsuId);
      setEmail(response.data.data.email);
      setDesignation(response.data.data.userType);
      setComplainList(response.data.data.Complains);
      response.data.data.ComplainReviewers.map((i) => {
        i.Complain.status == "Open"
          ? openComplain.push(i)
          : closeComplain.push(i);
      });
      setReviewComplainList(openComplain);
      setReviewedComplainList(closeComplain);
      setIsReviewer(response.data.data.actorType == "Reviewer" ? true : false);
    }
    fetchData();
  }, []);

  if (!token) {
    window.location.replace("http://localhost:3000");
  }

  const myComplainsButtonClicked = () => {
    setMyComplainSelectedClass("btn-light card-shadow");
    setReviewComplainSelectedClass("");
    setReviewedComplainSelectedClass("");
  };

  const reviewedComplainButtonClicked = () => {
    setMyComplainSelectedClass("");
    setReviewComplainSelectedClass("");
    setReviewedComplainSelectedClass("btn-light card-shadow");
  };

  return (
    <>
      <div class="flex-grow-1 background-color d-flex">
        <div className="container-fluid">
          <div className="row">
            <div className="col-4 border border-5 border-white rounded-3 my-4 ms-4 card-shadow">
              <div class="d-flex flex-column align-items-center">
                <img
                  src={require("../Assets/User-Profile.png")}
                  alt=""
                  height="150"
                  class="d-inline-block align-text-top mt-5 align-items-center justify-content-center"
                ></img>
              </div>
              <h5 class="mt-3">Name: {name}</h5>
              <h5 class="mt-3">NSU ID: {nsuId}</h5>
              <h5 class="mt-3">Email: {email}</h5>
              <h5 class="mt-3">Designation: {designation}</h5>
              <div className="d-block mt-4">
              </div>
            </div>
            <div class="col-7 my-4 ms-4">
              <button
                type="button"
                class={"btn btn-lg " + myComplainsSelectedClass}
                onClick={myComplainsButtonClicked}
              >
                User Complain(s)
              </button>
              <div
                className={
                  "h-100 flex-column d-" +
                  (!myComplainsSelectedClass ? "none" : "flex")
                }
              >
                {complainList.length != 0 ? (
                  complainList.map((e) => <AdminComplainRow complain={e} />)
                ) : (
                  <h1 class="pt-4 ">No Complain Lodged</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminViewAllCom;
