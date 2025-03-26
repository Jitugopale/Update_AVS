// import React, { useState } from "react";
// import Select from "react-select";
// import "bootstrap/dist/css/bootstrap.min.css";

// const BankCreditAdd = () => {
//   const [selectedBank, setSelectedBank] = useState(null);
//   const [bankData, setBankData] = useState([
//     { id: "bank1", label: "Bank 1", amount: "" },
//     { id: "bank2", label: "Bank 2", amount: "" },
//     { id: "bank3", label: "Bank 3", amount: "" },
//     { id: "bank4", label: "Bank 4", amount: "" },
//     { id: "bank5", label: "Bank 5", amount: "" },
//   ]);

//   // Handle bank selection
//   const handleBankSelect = (option) => {
//     const selected = bankData.find((b) => b.id === option.value);
//     setSelectedBank(selected);
//   };

//   // Handle amount input only for selected bank
//   const handleAmountChange = (bankId, newAmount) => {
//     setBankData((prev) =>
//       prev.map((bank) =>
//         bank.id === bankId ? { ...bank, amount: newAmount } : bank
//       )
//     );
//   };

//   // Ensure selected bank appears at the top
//   const sortedBanks = selectedBank
//     ? [selectedBank, ...bankData.filter((b) => b.id !== selectedBank.id)]
//     : bankData;

//   // Dropdown should show top 3 banks first, still searchable
//   const topThreeBanks = bankData.slice(0, 3).map((bank) => ({
//     value: bank.id,
//     label: bank.label,
//   }));

//   return (
//     <div className="container mt-4">
//       <h3 className="mb-3">Add Credit</h3>

//       {/* Search Bank Dropdown */}
//       <div className="mb-3">
//         <label className="form-label">Search Bank</label>
//         <Select
//           options={topThreeBanks}
//           value={selectedBank ? { value: selectedBank.id, label: selectedBank.label } : null}
//           onChange={handleBankSelect}
//           placeholder="Search and select a bank..."
//           isSearchable
//         />
//       </div>

//       {/* Bank Credit Table */}
//       <table className="table table-bordered">
//         <thead className="table-dark">
//           <tr>
//             <th>Sr No</th>
//             <th>Bank Name</th>
//             <th>Amount</th>
//             <th>Credit</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedBanks.map((bank, index) => (
//             <tr key={bank.id}>
//               <td>{index + 1}</td>
//               <td>{bank.label}</td>
//               <td>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={bank.amount}
//                   onChange={(e) => handleAmountChange(bank.id, e.target.value)}
//                   placeholder="Enter amount"
//                   disabled={selectedBank === null ? true : selectedBank.id !== bank.id} 
//                 />
//               </td>
//               <td>
//                 <button className="btn btn-success btn-sm" disabled={!bank.amount}>
//                   Credit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BankCreditAdd;

import React, { useState } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const BankCreditAdd = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [dropdownSearch, setDropdownSearch] = useState(""); // Track search input
  const [searchQuery, setSearchQuery] = useState("");


  const [bankData, setBankData] = useState([
    { id: "bank1", value: "bank1", label: "Bank 1", amount: "" },
    { id: "bank2", value: "bank2", label: "Bank 2", amount: "" },
    { id: "bank3", value: "bank3", label: "Bank 3", amount: "" },
    { id: "bank4", value: "bank4", label: "Bank 4", amount: "" },
    { id: "bank5", value: "bank5", label: "Bank 5", amount: "" },
  ]);

  // Handle search selection

  // Handle bank selection

  const handleBankSelect = (option) => {
    const selected = bankData.find((b) => b.id === option.value);
    setSelectedBank(selected);
    setSearchQuery(selected.label); // Set search query to highlight selected bank in table
  };
  // Handle amount input only for selected bank
  const handleAmountChange = (bankValue, newAmount) => {
    setBankData((prev) =>
      prev.map((bank) =>
        bank.value === bankValue ? { ...bank, amount: newAmount } : bank
      )
    );
  };

  const dropdownOptions = dropdownSearch
  ? bankData.map((bank) => ({ value: bank.id, label: bank.label })) // Show all when searching
  : bankData.slice(0, 3).map((bank) => ({ value: bank.id, label: bank.label })); // Show only top 3 by default

  const filteredBanks = bankData.filter((bank) =>
    bank.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBanks = filteredBanks.sort((a, b) => {
    if (a.label.toLowerCase() === searchQuery.toLowerCase()) return -1;
    return 0;
  });
  
  // Move selected bank to top in table
  // const sortedBankTable = selectedBank
  //   ? [selectedBank, ...bankData.filter((bank) => bank.value !== selectedBank.value)]
  //   : bankData;

  // Sort top 3 banks first
  // const sortedBankOptions = [
  //   ...bankData.slice(0, 3), // Top 3 banks
  //   ...bankData.slice(3).sort((a, b) => a.label.localeCompare(b.label)), // Remaining sorted
  // ];

  

  return (
    <>
    <div className="container mt-3">
       <div className="card">
          <div className="card-header">
          <h3 className="mb-3">Add Credit</h3>
          </div>
          <div className="card-body">
          <div className="container mt-4">

{/* Search Bank Dropdown */}
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

{/* Bank Credit Table */}
<table className="table table-bordered">
  <thead className="table-dark">
    <tr>
      <th>Sr No</th>
      <th>Bank Name</th>
      <th>Amount</th>
      <th>Credit</th>
    </tr>
  </thead>
  <tbody>
    {sortedBanks.map((bank, index) => (
      <tr key={bank.value}>
        <td>{index + 1}</td>
        <td>{bank.label}</td>
        <td>
          <input
            type="number"
            className="form-control"
            value={bank.amount}
            onChange={(e) => handleAmountChange(bank.value, e.target.value)}
            placeholder="Enter amount"
            disabled={!selectedBank || selectedBank.value !== bank.value} // Allows editing only for selected bank
          />
        </td>
        <td>
          <button
            className="btn btn-success btn-sm"
            disabled={!bank.amount}
          >
            Credit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
          </div>
       </div>
    </div>
   
    </>
  );
};

export default BankCreditAdd;
