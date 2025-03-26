import React, { useState} from "react";
import { Form } from "react-bootstrap";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import NewClient from "./NewClient";
import ExistingClient from "./ExistingClient";

const AvsAdmin = () => {
  const [clientType, setClientType] = useState("");
  const [existingType, setExistingType] = useState("");
  // const [creditRequested, setCreditRequested] = useState(false);

  // const handleNewClient = () => {
  //   setClientType("new");
  // };

  // const handleExistingClient = () => {
  //   setExistingType("existing");
  //   setCreditRequested(true);
  // };

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-header">
          <h4 className="mb-4">ADD Client API Credit</h4>
        </div>
        <div className="card-body">
          <div className="container">
            <div className="d-flex row align-items-center">
              <div className="col-2" style={{minWidth:'130px'}}>
                <h6>Add Credit :</h6>
              </div>
              <div className="col-2">
              <Form.Select
                  onChange={(e) => {
                    const value = e.target.value;
                    setClientType(value === "new" ? value : "");
                    setExistingType(value === "existing" ? value : "");
                  }}
                  style={{minWidth:'130px'}}
                >
                  <option value="">Select</option>
                  <option value="new">New Client</option>
                  <option value="existing">Existing Client</option>
                </Form.Select>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <NewClient clientType={clientType} />
            <ExistingClient existingType={existingType}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvsAdmin;
