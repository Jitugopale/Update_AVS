import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const BankEnableDis = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankData, setBankData] = useState([
    { id: "bank1", name: "Bank 1", enabled: false },
    { id: "bank2", name: "Bank 2", enabled: false },
    { id: "bank3", name: "Bank 3", enabled: false },
    { id: "bank4", name: "Bank 4", enabled: false },
    { id: "bank5", name: "Bank 5", enabled: false },
  ]);

  // Convert bank data for react-select
  const bankOptions = bankData.map((bank) => ({
    value: bank.id,
    label: bank.name,
  }));

  // Handle bank selection
  const handleBankSelect = (option) => {
    const selected = bankData.find((b) => b.id === option.value);
    setSelectedBank(selected);
  };

  // Toggle Enable/Disable status
  const handleToggle = (id) => {
    setBankData((prevBanks) =>
      prevBanks.map((bank) =>
        bank.id === id ? { ...bank, enabled: !bank.enabled } : bank
      )
    );

    // Update selected bank if it is the one being toggled
    if (selectedBank && selectedBank.id === id) {
      setSelectedBank((prev) => ({ ...prev, enabled: !prev.enabled }));
    }
  };

  return (
    <div className="container mt-3">
      <h3 className="mb-3">Bank Enable/Disable</h3>

      {/* Search Bank */}
      <div className="mb-3">
        <label className="form-label">Search Bank</label>
        <Select
          options={bankOptions}
          value={selectedBank ? { value: selectedBank.id, label: selectedBank.name } : null}
          onChange={handleBankSelect}
          placeholder="Search and select a bank..."
          isSearchable
        />
      </div>

      {/* Bank Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Sr No</th>
            <th>Bank Name</th>
            <th>Bank ID</th>
            <th>Enable/Disable</th>
          </tr>
        </thead>
        <tbody>
          {bankData.map((bank, index) => (
            <tr key={bank.id}>
              <td>{index + 1}</td>
              <td>{bank.name}</td>
              <td>{bank.id}</td>
              <td>
                <button
                  className={`btn btn-sm ${bank.enabled ? "btn-danger" : "btn-success"}`}
                  onClick={() => handleToggle(bank.id)}
                >
                  {bank.enabled ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankEnableDis;
