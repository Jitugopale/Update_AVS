import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/Authentication/LandingPage";
import Dashboard from "../Layout/Dashboard";
import LoginPage from "../Pages/Authentication/LoginPage";
import RegisterPage from "../Pages/Authentication/RegisterPage";
import 'boxicons/css/boxicons.min.css';
import PancardVerificationPage from "../Pages/Verification/PancardVerificationPage";
import OTPVerification from "../Pages/Authentication/OTPVerification";
import AadhaarVerificationPage from "../Pages/Verification/AadhaarVerificationPage";
import VoterVerificationPage from "../Pages/Verification/VoterVerificationPage";
import GSTVerificationPage from "../Pages/Verification/GSTVerificationPage";
import PanDetail from "../Pages/Verification/PanDetail";
import UdyamAadhaar from "../Pages/Verification/UdyamAadhaar";
import Cont from "../NewDash/Cont";
import PassportVerification from "../Pages/Verification/PassportVerification";
import Logout from "../Pages/Authentication/Logout";
import UserProfile from "../Pages/Authentication/UserProfile";
import CreditVerificationPage from "../Pages/Verification/CreditVerificationPage";
import Loan from "../Pages/Verification/Loan";
import MainPdf from "../Pages/Verification/MainPdf";
import BranchCreate from "../Pages/Verification/BranchCreate";
import UserCreate from "../Pages/Verification/UserCreate";
import AdminDashboard from "../Pages/Verification/AdminDashboard";
import AshADmin from "../Layout/AshADmin";
import PasswordChange from "../NewDash/PasswordChange";
import BranchMaster from "../Pages/Authentication/BranchMaster";
import RoleMaster from "../Pages/Authentication/RoleMaster";
import UserCreated from "../Pages/Authentication/UserCreated";
import AdminBankCreate from "../Pages/Authentication/AdminBankCreate";
import BankCreditAdd from "../Pages/Authentication/BankCreditAdd";
import Activation from "../Pages/Authentication/Activation";
import BankPasswordChange from "../Pages/Authentication/BankPasswordChange";
import UserEnabDis from "../Pages/Authentication/UserEnabDis";
import ClientEnableDis from "../Pages/Authentication/BankEnableDis";
import ApiCredits from "../Pages/Authentication/ApiCredits";
import AvsAdmin from "../Pages/Authentication/AvsAdmin";

const RouteApp = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/user" element={<UserProfile/>} />
          <Route path="/master" element={<BranchMaster/>} />
          <Route path="/rolemaster" element={<RoleMaster/>} />
          <Route path="/usercreated" element={<UserCreated/>} />
          <Route path="/adminbank" element={<AdminBankCreate/>} />
          <Route path="/bankCredit" element={<BankCreditAdd/>} />
          <Route path="/activate" element={<Activation/>} />
          <Route path="/passchange" element={<BankPasswordChange/>} />
          <Route path="/userenabdis" element={<UserEnabDis/>} />
          <Route path="/clientenabdis" element={<ClientEnableDis/>} />
          <Route path="/apicredits" element={<ApiCredits/>} />
          <Route path="/avsAdmin" element={<AvsAdmin/>} />
          {/* <Route path="/adminDashboard" element={<AdminDashboard/>} /> */}
          <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Cont/>} /> 
              {/* <Route path="adminDashboard" element={<AdminDashboard />} /> */}
              <Route path="pan" element={<PancardVerificationPage/>} />
              <Route path="aadhaar" element={<AadhaarVerificationPage/>}/>
              <Route path="voter" element={<VoterVerificationPage/>}/>
              <Route path="gst" element={<GSTVerificationPage/>}/>
              <Route path="pandetail" element={<PanDetail/>}/>
              <Route path="udyam" element={<UdyamAadhaar/>}/>
              <Route path="passport" element={<PassportVerification/>}/>
              <Route path="credit" element={<CreditVerificationPage/>}/>
              <Route path="loan" element={<Loan/>}/>
              <Route path="main" element={<MainPdf/>}/>
              <Route path="branch" element={<BranchCreate/>}/>
              <Route path="userCreate" element={<UserCreate/>}/>
              <Route path="passwordChange" element={<PasswordChange/>}/>
          </Route>
          <Route path="/adminDashboard" element={<AshADmin/>}>
              {/* <Route path="adminDashboard" element={<AdminDashboard />} /> */}
              <Route index element={<AdminDashboard/>} /> 
              <Route path="pan" element={<PancardVerificationPage/>} />
              <Route path="aadhaar" element={<AadhaarVerificationPage/>}/>
              <Route path="voter" element={<VoterVerificationPage/>}/>
              <Route path="gst" element={<GSTVerificationPage/>}/>
              <Route path="pandetail" element={<PanDetail/>}/>
              <Route path="udyam" element={<UdyamAadhaar/>}/>
              <Route path="passport" element={<PassportVerification/>}/>
              <Route path="credit" element={<CreditVerificationPage/>}/>
              <Route path="loan" element={<Loan/>}/>
              <Route path="main" element={<MainPdf/>}/>
              <Route path="branch" element={<BranchCreate/>}/>
              <Route path="userCreate" element={<UserCreate/>}/>
              <Route path="passwordChange" element={<PasswordChange/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default RouteApp;
