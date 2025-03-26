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

  const formatDate = (date) => {
    return date.toISOString();
};

  const [formData, setFormData] = useState({
    ClientName: "",
    ClientEmail: "",
    Contact: "",
    LoginId: "",
    Password: "",
    RegistrationNo: "",  
  });

  

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
      const response = await axios.post("https://localhost:7057/api/admin/client-register", formData);
      console.log(response)

      if (response.data.data > 0) {
        setSuccess("Registration successful! Redirecting to login...");
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Registration failed. Please try again.");
        console.log("Register Failed");
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
        <div className="p-2 d-flex align-items-center"  style={{ backgroundImage: `url(${img})`, height:'87vh'}}>
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
    id="ClientName"
    name="ClientName"
    placeholder="Bank Name"
    value={formData.ClientName}
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
            <label htmlFor="ClientEmail" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Email <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="ClientEmail"
              name="ClientEmail"
              placeholder="Email ID"
              value={formData.ClientEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="registrationNo" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>Bank Registration No <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="RegistrationNo"
              name="RegistrationNo"
              placeholder="Bank Registration No"
              value={formData.RegistrationNo}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* <div className="row" id="starss">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="address" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Address <span style={{ color: "red" }}>*</span></label>
            <textarea
              className="form-control"
              id="clientadD1"
              name="clientadD1"
              rows="2"
              value={formData.Contact}
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
        </div> */}
        <div className="row" id="star">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="Contact" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>Contact Number <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="Contact"
              name="Contact"
              placeholder="Mobile Number"
              value={formData.Contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="LoginId" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px',marginLeft:'15px'}}>User ID <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              id="LoginId"
              name="LoginId"
              placeholder="User ID"
              value={formData.LoginId}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* <div className="row" id="star">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start mb-3">
            <label htmlFor="state" className="form-label text-start mt-2" style={{width:'300px', maxWidth:'300px'}}>State <span style={{ color: "red" }}>*</span></label>
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
        </div> */}
        {/* <div className="row" id="star">
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
        </div> */}
        {/* <div className="row" id="star">
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
        </div> */}
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
