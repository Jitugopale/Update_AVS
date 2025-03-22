// import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS
// import * as XLSX from "xlsx"; // Import xlsx library


// const Dropdown = () => {
//   useEffect(() => {
//     // Bootstrap auto-initializes dropdowns, so no need for manual initialization
//   }, []);
//   const transactions = Array.from({ length: 30 }, (_, i) => ({
//     id: i + 1,
//     raisedRate: (Math.random() * 10).toFixed(2),
//     raiseAmt: (Math.random() * 100).toFixed(2),
//     balance: (Math.random() * 500).toFixed(2),
//   }));

//   const handleExportExcel = () => {
//     const excelData = transactions.slice(0, recordsToShow).map((t) => ({
//       "Raised Rate": t.raisedRate,
//       "Raise Amt": t.raiseAmt,
//       "Balance": t.balance,
//     }));

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(excelData);
//     XLSX.utils.book_append_sheet(wb, ws, "Transactions");
//     XLSX.writeFile(wb, "transactions.xlsx");
//   };

//   return (
//     <div className="btn-group">
//       <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown">
//         Action
//       </button>
//       <ul className="dropdown-menu">
//         <li><a className="dropdown-item" href="#">Action</a></li>
//         <li><a className="dropdown-item" href="#">Another action</a></li>
//         <li><a className="dropdown-item" href="#">Something else here</a></li>
//         <li><hr className="dropdown-divider" /></li>
//         <li><a className="dropdown-item" href="#">Separated link</a></li>
//       </ul>
//     </div>
//   );
// };

// export default Dropdown;
