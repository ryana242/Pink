import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ViewHistory() {
  const { id } = useParams();
  const [versionDetails, setVersionDetails] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get("http://localhost:8000/home/total-edits", {
        params: {
          complainUNID: id,
        },
      });

      if (response.data.data == null) {
        window.location.replace("http://localhost:3000");
      }
      let totalEdits = response.data.data.edits;

      let tempArr = [];
      for (let i = 0; i < totalEdits; i++) {
        let response = await axios.get(
          "http://localhost:8000/home/complain-history",
          {
            params: {
              complainUNID: id,
              id: i,
            },
          }
        );
        tempArr.push(response.data.data[0]);
      }
      setVersionDetails(tempArr);
    }
    fetchData();
  }, []);

  return (
    <div class="flex-grow-1 background-color d-flex">
      <div className="container-fluid ms-5">
        <div className="row">
          <div class="col-7 my-4 ms-2">
            <div className="row">
              <div className="col-7">
                <h2 className="my-3 d-block">Edit History:</h2>
              </div>
              <div className="col-5"></div>
            </div>
            {versionDetails.length == 0 ? (<h4>No Edit History</h4>) : (
              versionDetails.map((e) => (
                <div class="mb-5">
                  <div className="row">
                    <div className="col-3">
                      <div className="d-flex justify-content-between">
                        <div className="h5">Version</div>
                        <div className="h5">:</div>
                      </div>
                    </div>
                    <div className="col-9">
                      <h5>{e.ComplainAgainsts[0].editHistory + 1}</h5>
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
                      <h5>{e.ComplainDescriptions[0].complainDescription}</h5>
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
                      <h5>
                        {e.ComplainAgainsts.length != 0 ? (
                          e.ComplainAgainsts.map((e) => (
                            <h5>{e.User.fullName}</h5>
                          ))
                        ) : (
                          <h1></h1>
                        )}
                      </h5>
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
                        <h5>
                          {e.Evidence.map((src, index) => (
                            <div className="mb-2">
                              <a
                                className="h5"
                                href={
                                  "http://localhost:8000/uploads/Evidence/" +
                                  src.evidence
                                }
                                target="_blank"
                                download={index + 1}
                              >
                                Evidence {index + 1}
                              </a>
                            </div>
                          ))}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewHistory;
