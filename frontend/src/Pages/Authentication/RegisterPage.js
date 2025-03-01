import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import MainNavbar from "./MainNavbar";
import './Register.css'
import img from "./images/back2.jpg"


const RegisterPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    // Automatically update the `dateOfAdmission` field in the form
    setFormData((prevFormData) => ({
      ...prevFormData,
      clientdoj: formatDate(currentDate),
    }));

    return () => clearInterval(timer); // Cleanup the timer
  }, []);

  // const formatDate = (date) => {
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };
  const formatDate = (date) => {
    return date.toISOString(); // Converts to "YYYY-MM-DDTHH:mm:ssZ"
};

  const [formData, setFormData] = useState({
    clientnm: "",
    clientnobranches: "",
    clientadD1: "",
    clienttouronver: "",
    statecd: "",
    mailid: "",
    officernm: "",
    socregno: "",
    cntctprsn: "",
    moB1: "",
    districtcd: "",
    talukacd: "",
    pincode: "",
    clientdoj: formatDate // Automatically generated
  });

  
  // const [formData, setFormData] = useState({
  //   CLIENTNM: "",
  //   CLIENTNOBRANCHES: "",
  //   CLIENTADD1: "",
  //   CLIENTTOURONVER: "",
  //   STATECD: "",
  //   MAILID: "",
  //   OFFICERNM: "",
  //   registrationNo: "",
  //   CNTCTPRSN: "",
  //   MOB1: "",
  //   DISTRICTCD: "",
  //   TALUKACD: "",
  //   PINCODE: "",
  //   dateOfAdmission: formatDate // Automatically generated
  // });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost/DocVerification/api/BankRegister", formData);
      console.log(response)

      if (response.data.outcome.outcomeId === 1) {
        setSuccess("Registration successful! Redirecting to login...");
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Registration failed. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Network error. Please try again later."
      );
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <MainNavbar/>
        <div className="p-2"  style={{ backgroundImage: `url(${img})`}}>
        <div className="container mt-3 mb-3 card" style={{ maxWidth: "1000px", padding: "15px" }}>
      <h3 className="text-md-center text-start mb-2">Client Master</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
      <div className="row" id="star">
      <div className="col-12 col-md-8 d-flex flex-column flex-md-row align-items-start mb-3">
  <label
    htmlFor="bankName"
    className="form-label text-start mt-2"
    style={{width:'253px', maxWidth:'253px'}}
  >
    Bank Name <span style={{ color: "red" }}>*</span>
  </label>
  <input
    type="text"
    className="form-control"
    id="clientnm"
    name="clientnm"
    placeholder="Bank Name"
    value={formData.clientnm}
    onChange={handleChange}
    required
    style={{ flexGrow: 1 }}
  />
</div>

  <div className="col-12 col-md-4 d-flex flex-column flex-md-row align-items-start mb-3">
    <label
      htmlFor="clientdoj"
      className="form-label text-start mt-2"
      style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}
    >
      Date of Admission
    </label>
    <p className="form-control" id="clientdoj" style={{ flexGrow: 1 ,backgroundColor:"#D3D3D3"}}>
        {formatDate(currentDate)}
      </p>
  </div>
</div>

        <div className="row" id="stars">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="clientnobranches" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>No of Branches <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="clientnobranches"
              name="clientnobranches"
              placeholder="No of Branches"
              value={formData.clientnobranches}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="registrationNo" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>Bank Registration No <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="socregno"
              name="socregno"
              placeholder="Bank Registration No"
              value={formData.socregno}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row" id="starss">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="address" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Address <span style={{ color: "red" }}>*</span></label>
            <textarea
              className="form-control"
              id="clientadD1"
              name="clientadD1"
              rows="2"
              value={formData.clientadD1}
              placeholder="Address"
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="contactPerson" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>Contact Person Name <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="cntctprsn"
              name="cntctprsn"
              placeholder="Contact Person Name"
              value={formData.cntctprsn}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row" id="star">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="totalTurnover" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Total Turnover of Bank <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="clienttouronver"
              name="clienttouronver"
              placeholder="Total Turnover of Bank"
              value={formData.clienttouronver}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="mobile" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>Mobile Number <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="moB1"
              name="moB1"
              placeholder="Mobile Number"
              value={formData.moB1}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row" id="star">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="state" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>State <span style={{ color: "red" }}>*</span></label>
            {/*<span style={{ color: "red" }}>*</span> <select
              className="form-control"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="State1">State 1</option>
              <option value="State2">State 2</option>
            </select> <span style={{ color: "red" }}>*</span>*/}
            <input
              type="text"
              className="form-control"
              id="statecd"
              name="statecd"
              placeholder="State"
              value={formData.statecd}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="district" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>District <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="districtcd"
              name="districtcd"
              placeholder="District "
              value={formData.districtcd}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row" id="star">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="email" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Email ID <span style={{ color: "red" }}>*</span></label>
            <input
              type="email"
              className="form-control"
              id="mailid"
              name="mailid"
              value={formData.mailid}
              placeholder="Email ID"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="taluka" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>Taluka <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="talukacd"
              name="talukacd"
              placeholder="Taluka"
              value={formData.talukacd}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row" id="star">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="projectOfficer" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Name Project Officer <span style={{ color: "red" }}>*</span></label>
            <select
              className="form-control"
              id="officernm"
              name="officernm"
              value={formData.officernm}
              onChange={handleChange}
              required
            >
              <option value="">--Select--</option>
              <option value="Officer1">Officer 1</option>
              <option value="Officer2">Officer 2</option>
            </select>
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="pinCode" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>Pin Code <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="pincode"
              placeholder="Pin Code"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Register"}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </form>
    </div>
        </div>
    </>
  );
};

export default RegisterPage;
