import React, { useState, useEffect } from "react";
import axios from "axios";
import BranchUserTable from "../Verification/BranchUserTable.js";
import Select from "react-select";

const UserCreated = () => {
  const [superAdminKey, setSuperAdminKey] = useState("");
  const [userKey, setUserKey] = useState("");
  const [ClientName, setClientName] = useState("");
  const [ClientEmail, setClientEmail] = useState("");
  const [Contact, setContact] = useState("");
  const [LoginId, setLoginId] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [RoleId, setRoleId] = useState(null);
  const [BranchId, setBranchId] = useState(null);
  const [AllowdIP, setAllowdIP] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [token, setToken] = useState("");

  // Fetch stored user data from session storage
  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
    console.log("Stored", storedUserData);
    if (storedUserData) {
      setSuperAdminKey(storedUserData.superAdminKey);
      setUserKey(storedUserData.userkey);
      setToken(storedUserData.access_token);
    }
  }, []);

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Get token from session storage

      if (!token || !superAdminKey || !userKey) {
        console.error("Missing authentication details!");
        return;
      }
      const response = await axios.post(
        "http://103.228.152.233:8130/api/admin/getRoles",
        {
          superAdminKey,
          userKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      // Ensure correct access of response data
      if (response.data.returnSuccess === true) {
        const roleOptions = response.data.data.map((role) => ({
          value: role.roleId,
          label: role.roleName,
        }));

        setRoles(roleOptions);
      } else {
        console.error("No Role data received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching Roles:", error);
    }
  };

  // Fetch Branches
  const fetchBranches = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Get token from session storage

      if (!token || !superAdminKey || !userKey) {
        console.error("Missing authentication details!");
        return;
      }

      const response = await axios.post(
        "http://103.228.152.233:8130/api/admin/getBranches",
        {
          superAdminKey,
          userKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      // Ensure correct access of response data
      if (response.data.returnSuccess === true) {
        const branchOptions = response.data.data.map((branch) => ({
          value: branch.branchId,
          label: branch.branchName,
        }));

        setBranches(branchOptions);
      } else {
        console.error("No branch data received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  // Fetch roles and branches when superAdminKey and userKey are available
  useEffect(() => {
    if (superAdminKey && userKey) {
      fetchRoles();
      fetchBranches();
    }
  }, [superAdminKey, userKey]);

  const handleClear = () => {
    setClientName("");
    setClientEmail("");
    setContact("");
    setLoginId("");
    setPassword("");
    setConfirmPassword("");
    setRoleId(null);
    setBranchId(null);
    setAllowdIP("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (Password !== ConfirmPassword) {
    //   setMessage("Passwords do not match!");
    //   return;
    // }

    // Fix: Ensure correct timestamp format
    const currentTimestamp = new Date().toISOString();

    const newUser = {
      createdBy: superAdminKey,
      createdOn: currentTimestamp, // Fix: Provide valid date
      modifiedBy: superAdminKey,
      modifiedOn: currentTimestamp, // Fix: Provide valid date
      superAdminKey,
      userKey,
      clientName: ClientName,
      clientEmail: ClientEmail,
      contact: Contact,
      loginId: LoginId,
      password: Password,
      roleId: RoleId.value,
      branchId: BranchId.value,
      allowdIP: "",
    };

    try {
      const response = await axios.post(
        "http://103.228.152.233:8130/api/admin/addclientuser",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      if (response.data.returnSuccess === true) {
        setMessageType("success"); // ✅ Set success type
        setMessage(
          response.data.returnMessage?.[0] || "User registered successfully!"
        );

        setTimeout(() => {
          setMessage(" "); // 🔥 Clear message after 1 second
          handleClear();
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      setMessageType("error");
      setMessage(error.response?.data?.returnMessage?.[0] || "Server error");
      setTimeout(() => {
        setMessage(" "); // 🔥 Clear message after 1 second
      }, 1000);
    }
  };

  return (
    <>
       <div className="container mt-3">
       <div className="card">
           <div className="card-header">
             <h5 className="mb-3">Branch User Create</h5>
           </div>
           <div className="card-body">
           <div className="container">
        <div className="p-3" style={{ maxWidth: "1200px", width: "100%" }}>
          {/* {message && <p className="text-danger">{message}</p>} */}
          {message && (
            <div
              style={{
                color: messageType === "success" ? "green" : "red", // ✅ Green for success, Red for error
                marginTop: "10px",
                padding: "5px",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="row">
              {/* <div className="col-md-4 mb-3">
              <label htmlFor="superAdminKey" className="form-label">
                Super Admin Key
              </label>
              <input
                type="text"
                className="form-control"
                id="superAdminKey"
                value={superAdminKey}
                disabled
              />
            </div> */}

              <div className="col-md-4 mb-3">
                <label htmlFor="ClientName" className="form-label">
                  Client Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ClientName"
                  value={ClientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="ClientEmail" className="form-label">
                  Client Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="ClientEmail"
                  value={ClientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="LoginId" className="form-label">
                  Login ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="LoginId"
                  value={LoginId}
                  onChange={(e) => setLoginId(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="Contact" className="form-label">
                  Contact
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Contact"
                  value={Contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Role</label>
                <Select
                  options={roles}
                  value={
                    roles.find((role) => role.value === RoleId?.value) || null
                  }
                  onChange={(selectedOption) => setRoleId(selectedOption)}
                  placeholder="Select Role"
                  isClearable
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Branch</label>
                <Select
                  options={branches}
                  value={
                    branches.find(
                      (branch) => branch.value === BranchId?.value
                    ) || null
                  }
                  onChange={(selectedOption) => setBranchId(selectedOption)}
                  placeholder="Select Branch"
                  isClearable
                />
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-primary me-3">
                Submit
              </button>
              <button
                type="reset"
                className="btn btn-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>

          <BranchUserTable />
        </div>
      </div>
           </div>
       </div>
    </div>
   
    </>
  );
};

export default UserCreated;
