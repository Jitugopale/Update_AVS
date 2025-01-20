// import React from "react";
// import { Link } from "react-router-dom";

// const LandingPage = () => {
//   return (
//     <>
//       <div className="container-fluid">
//         <div className="d-flex justify-content-center align-items-center vh-100">
//           <div className="card shadow p-3">
//             <h1 className="card-title">Welcome to AVSVerify</h1>
//             <p className="card-text">
//               Securely verify various documents online with ease and reliability
//             </p>
//             <div className="row d-flex justify-content-center gap-3">
//               <div className="col-2">
//                 <Link to="/register">
//                   <button type="button" className="btn btn-primary">
//                     Register
//                   </button>
//                 </Link>
//               </div>
//               <div className="col-2">
//                 <Link to="/login">
//                   <button type="button" className="btn btn-success">
//                     Login
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LandingPage;

import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
        <div style={{background:'linear-gradient(to right, #6a11cb, #2575fc'}}>
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100" style={{
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
      }} role="main" >
      <div className="card p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%', }}>
        <h1 className="heading-landing mb-4 text-center">Welcome to TrueVerify</h1>
        <p className="text-center mb-4">Securely verify various documents online with ease and reliability</p>
        <div className="d-flex justify-content-center mt-4">
          <Link 
            to="/login" 
            className="btn btn-primary mx-2" 
            aria-label="Login to your account">
            Login
          </Link>
          <Link 
            to="/register" 
            className="btn btn-secondary mx-2" 
            aria-label="Create a new account">
            Register
          </Link>
        </div>
      </div>
    </div>
        </div>
    </>
  );
};

export default LandingPage;
