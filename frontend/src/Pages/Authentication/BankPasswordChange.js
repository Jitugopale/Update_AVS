import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const BankPasswordChange = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownSearch, setDropdownSearch] = useState(""); // Track search input

  const [bankData, setBankData] = useState([
    { id: "bank1", label: "Bank 1", username: "User 1" },
    { id: "bank2", label: "Bank 2", username: "User 2" },
    { id: "bank3", label: "Bank 3", username: "User 3" },
    { id: "bank4", label: "Bank 4", username: "User 4" },
    { id: "bank5", label: "Bank 5", username: "User 5" },
  ]);

  const [passwordData, setPasswordData] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle selection from dropdown
  const handleBankSelect = (option) => {
    const selected = bankData.find((b) => b.id === option.value);
    setSelectedBank(selected);
    setSearchQuery(selected.label); // Set search query to highlight selected bank in table
  };

  // Open modal and set selected bank
  const openModal = (bank) => {
    setSelectedBank(bank);
    setPasswordData({ username: bank.username, newPassword: "", confirmPassword: "" });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setPasswordData({ username: "", newPassword: "", confirmPassword: "" });
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password change submit
  const handleSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Password changed successfully for ${selectedBank.label}`);
    closeModal();
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const dropdownOptions = dropdownSearch
  ? bankData.map((bank) => ({ value: bank.id, label: bank.label })) // Show all when searching
  : bankData.slice(0, 3).map((bank) => ({ value: bank.id, label: bank.label })); // Show only top 3 by default

  // Filter and sort banks based on search query
  const filteredBanks = bankData.filter((bank) =>
    bank.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBanks = filteredBanks.sort((a, b) => {
    if (a.label.toLowerCase() === searchQuery.toLowerCase()) return -1;
    return 0;
  });

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-header">
          <h3 className="mb-3">Change Password</h3>
        </div>
        <div className="card-body">
          <div className="container mt-4">
            
            {/* Combined Bank Selection & Search */}
            {/* <div className="mb-3">
              <label className="form-label">Search Bank</label>
              <Select
                options={bankData.map((bank) => ({ value: bank.id, label: bank.label }))}
                value={selectedBank ? { value: selectedBank.id, label: selectedBank.label } : null}
                onChange={handleBankSelect}
                placeholder="Search and select a bank..."
                isSearchable
              />
            </div> */}
            <div className="mb-3">
            <label className="form-label">Search Bank</label>
            <Select
              options={dropdownOptions}
              value={selectedBank ? { value: selectedBank.id, label: selectedBank.label } : null}
              onChange={handleBankSelect}
              placeholder="Search and select a bank..."
              isSearchable
              onInputChange={(input) => setDropdownSearch(input)}
            />
          </div>

            {/* <div className="mb-3">
              <label className="form-label">Search in Table</label>
              <input
                type="text"
                className="form-control"
                placeholder="Type to search bank..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div> */}

            {/* Bank Table */}
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Sr No</th>
                  <th>Bank Name</th>
                  <th>Username</th>
                  <th>Password Change</th>
                </tr>
              </thead>
              <tbody>
                {sortedBanks.map((bank, index) => (
                  <tr key={bank.id}>
                    <td>{index + 1}</td>
                    <td>{bank.label}</td>
                    <td>{bank.username}</td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => openModal(bank)}>
                        Change
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Password Change Modal */}
            {showModal && (
              <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Change Password for {selectedBank.label}</h5>
                      <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={passwordData.username}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleSubmit}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankPasswordChange;
