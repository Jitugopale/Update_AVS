import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import RegisterPage from "./RegisterPage";

const AdminBankCreate = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="container mt-4">
      {!showRegister ? (
        <>
        <div className="container">
       <div className="card">
          <div className="card-header">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Bank List</h4>
            <Button variant="primary" onClick={() => setShowRegister(true)}>
              + Add Bank
            </Button>
          </div>
          </div>
          <div className="card-body">

                {/* Bank Table */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Bank Name</th>
                <th>Bank Registration No</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No Bank Available
                </td>
              </tr>
            </tbody>
          </Table>
          </div>
       </div>
    </div>
         

      
        </>
      ) : (
        <RegisterPage />
      )}
    </div>
  );
};

export default AdminBankCreate;
