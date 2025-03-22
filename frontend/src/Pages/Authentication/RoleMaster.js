import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const RoleMaster = () => {
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);

  const addRole = () => {
    if (roleName.trim() !== "") {
      setRoles([...roles, roleName]);
      setRoleName("");
    }
  };

  const updateRole = (index) => {
    const newRoleName = prompt("Enter new role name:", roles[index]);
    if (newRoleName && newRoleName.trim() !== "") {
      const updatedRoles = [...roles];
      updatedRoles[index] = newRoleName;
      setRoles(updatedRoles);
    }
  };

  const deleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  return (
    <>
    <div className="container mt-5">
       <div className="card">
          <div className="card-header">
          <h2>Role Master</h2>
          </div>
          <div className="card-body">
          <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter Role Name"
        />
        <button className="btn btn-primary ms-2" onClick={addRole}>Add Role</button>
      </div>

      {roles.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Sr No</th>
              <th>Role Name</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{role}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => updateRole(index)}>Update</button>
                  <button className="btn btn-danger" onClick={() => deleteRole(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
          </div>
       </div>
    </div>
    </>
  );
};

export default RoleMaster;