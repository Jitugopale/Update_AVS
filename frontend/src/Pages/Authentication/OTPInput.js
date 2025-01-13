import React, { useState, useEffect } from "react";
import { useRecoveryContext } from "../Authentication/RecoveryContext"; // Corrected import
import axios from "axios";

export default function OTPVerification() {
  const { email, otp, setPage } = useRecoveryContext(); // Using the custom hook
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);

  // Resend OTP function
  const resendOTP = async () => {
    if (disable) return;
    try {
      await axios.post("http://localhost:5000/api/auth/send_recovery_email", {
        OTP: otp,
        recipient_email: email,
      });
      alert("A new OTP has been successfully sent to your email.");
      setDisable(true);
      setTimer(60); // Reset timer
    } catch (error) {
      alert("Failed to resend OTP. Please try again later.");
    }
  };

  // Verify OTP function
  const verifyOTP = () => {
    if (parseInt(OTPinput.join("")) === otp) {
      setPage("reset");
    } else {
      alert("The code you have entered is incorrect. Try again or resend the OTP.");
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timerCount > 0) {
      const interval = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setDisable(false); // Enable resend OTP button
    }
  }, [timerCount]);

  // Handle OTP input change
  const handleOTPChange = (e, index) => {
    const newOTP = [...OTPinput];
    newOTP[index] = e.target.value.slice(-1); // Limit input to one character
    setOTPinput(newOTP);

    // Focus on the next input
    if (e.target.value && index < OTPinput.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h1 className="font-semibold text-3xl">Email Verification</h1>
            <p className="text-sm font-medium text-gray-400">
              We have sent a code to your email {email}
            </p>
          </div>

          <form>
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {OTPinput.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    maxLength="1"
                    className="w-16 h-16 text-center px-5 rounded-xl border border-gray-200 text-lg focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    aria-label={`Enter OTP digit ${index + 1}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                  />
                ))}
              </div>

              <div className="flex flex-col space-y-5">
                <button
                  type="button"
                  onClick={verifyOTP}
                  className="w-full py-5 bg-blue-700 text-white rounded-xl text-sm shadow-sm"
                >
                  Verify Account
                </button>

                <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                  <p>Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={disable}
                    className={`${
                      disable ? "text-gray-400 cursor-not-allowed" : "text-blue-700 underline"
                    }`}
                  >
                    {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
