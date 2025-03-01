import bcrypt from "bcrypt"
import dotenv from 'dotenv';
import nodemailer from "nodemailer";
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken"
import Adhar from "../models/AadhaarSchema.js"
import User from "../models/userSchema.js"
import Pan from "../models/PanSchema.js"
import GST from "../models/GSTSchema.js"
import CREDIT from "../models/CreditSchema.js"
import VOTER from "../models/VoterSchema.js"
import PanDetail from "../models/PanDetailSchema.js";
import Passport from "../models/PassportSchema.js"
import Udyam from "../models/UdyamSchema.js"
import BankUser from '../models/BankUserSchema.js'
import Credentials from '../models/CredentialsSchema.js'
import BRANCH from '../models/BranchCreate.js'
import CREATEUSER from '../models/CreateUser.js'
import VerificationCount from "../models/VerificationCount.js"
import axios from 'axios';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET ||'Romanisagood$boy';
const SendOTP= process.env.SendOTP;
const VerifyOTP=process.env.VerifyOTP;
const Agent = process.env.Agent;
const PanVerify = process.env.PanVerify;
const authorisedkey = process.env.authorisedkey;
const VerifyVoter = process.env.VerifyVoter;
const VerifyPassport = process.env.VerifyPassport;
const VerifyCredit = process.env.VerifyCredit;
const VerifyGST = process.env.VerifyGST;
const VerifyUdyam = process.env.VerifyUdyam;
const VerifyPanDetails = process.env.VerifyPanDetails;
const partnerId = process.env.partnerId;
const API_SECRET = process.env.API_SECRET;
const Check = process.env.Check;


//Create User
export const createUserController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        fname: req.body.fname,
        Lname: req.body.Lname,
        Address: req.body.Address,
        PhoneNo: req.body.PhoneNo,
        email: req.body.email,
        password: secPass,
        City: req.body.City,
      });

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

//login User
export const loginController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log("Password Comparison:", passwordCompare); 

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
      console.log(JWT_SECRET);
    } catch (error) {
      console.log(JWT_SECRET);
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
}

//Get user
export const getuserController =  async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user); 
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
}

//Sent otp Aadhar
export const aadhaarOtpController = async (req, res) => {
  const { aadharNumber } = req.body;

  if (!aadharNumber) {
    return res.status(400).json({ message: "Aadhar number is required" });
  }

  // Check if Voter data already exists in the database
  const existingAadhaar = await Adhar.findOne({ aadharNumber });
  if (existingAadhaar) {
    return res.status(200).json({
      status: 'success',
      message: 'Aadhaar is already verified.',
      verifiedData: existingAadhaar.verifiedData, // Returning existing verified data
    });
  }

  try {
    const token = createToken();
    console.log(token)

    const otpResponse = await axios.post(
      'https://api.verifya2z.com/api/v1/verification/aadhaar_sendotp',
      { id_number: aadharNumber },
      {
        headers: {
          'Token': token,
          // 'Authorization': `Bearer ${token}` ,
          'User-Agent': 'CORP0000363',
        }
      }
    );

    if (otpResponse.status === 200) {
      const otpToken = jwt.sign(
        { client_id: otpResponse.data.data.client_id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        message: "OTP sent successfully.",
        token: otpToken, 
        client_id: otpResponse.data.data.client_id,
      });
    } else {
      return res.status(500).json({ message: "Failed to generate OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error generating OTP. Please try again."
    });
  }
};

function createToken() {
  const secretKey = process.env.secretKey;
  const symmetricKey = Buffer.from('UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5', 'utf8');
  const unixTimeStamp = Math.floor(Date.now() / 1000);

  const token = jwt.sign(
    { timestamp: unixTimeStamp, partnerId: 'CORP0000363', reqid: '1111' },
    symmetricKey,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  return token;
}


//Verify Aadhar
export const verifyAadhaarOtpController = async (req, res) => {
  const { clientId, OTP, aadharNumber } = req.body;

  if (!clientId || !OTP || !aadharNumber) {
    return res.status(400).json({ message: "Client ID, OTP, and Aadhar number are required" });
  }

  try {
    const token = createToken();
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const secretKey = process.env.secretKey; 
    jwt.verify(token, Buffer.from('UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5', 'utf8'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Signature verification failed" });
      }
      
      verifyOtp(clientId, OTP, token,aadharNumber, res);
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
};

async function verifyOtp(clientId, OTP, token,aadharNumber, res) {
  try {
    const otpVerifyResponse = await axios.post(
      'https://api.verifya2z.com/api/v1/verification/aadhaar_verifyotp',
      { client_id: clientId, otp: OTP },
      {
        headers: {
          'Token': token,  
          'User-Agent': 'CORP0000363'
        }
      }
    );
    console.log('OTP Verification Response:', otpVerifyResponse.data);


    if (otpVerifyResponse.data.statuscode === 200 && otpVerifyResponse.data.status === true) {
      const aadhaarData = otpVerifyResponse.data;

      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified Aadhaar details to the database
      const newAadhar = new Adhar({
        aadharNumber,  // Storing Aadhaar Number
        clientId,      // Storing Client ID
        status: 'verified',
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
        verifiedData: aadhaarData, // Storing the OTP verification response
      });

      await newAadhar.save();

      // Update the verification count for Aadhaar card in the database
      await updateVerificationCount('aadhar');
      return res.json({
        message: "Aadhaar verification successful.",
        aadhaarData,
      });
    } else {
      return res.status(400).json({ message: "OTP verification failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Error verifying OTP. Please try again."
    });
  }
}


//Pancard
// export const verifyPanCardController = async (req, res) => {
//   const { pannumber } = req.body;

//   if (!pannumber) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'PAN number is required',
//     });
//   }

//   try {
//     const token = createToken();
//     if (!token) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Unable to generate token for verification',
//       });
//     }

//     const response = await axios.post(
//       PanVerify,
//       { pannumber },
//       {
//         headers: {
//           Token: token,
//           'User-Agent': Agent,
//         },
//       }
//     );

//     console.log('API Response:', response.data);

//     if (response.data.statuscode === 200 && response.data.status === true) {
//       const { full_name, pan_number } = response.data.data;

//       req.body.verifiedData = { full_name, pan_number };

//       return res.status(200).json({
//         status: 'success',
//         message: response.data.message || 'PAN Card verified successfully.',
//         verifiedData: { full_name, pan_number },
//       });
//     } else {
//       return res.status(400).json({
//         status: 'error',
//         message:
//           response.data.message || 'PAN verification failed. Invalid details.',
//       });
//     }
//   } catch (error) {
//     console.error('PAN Verification Error:', error);

//     return res.status(500).json({
//       status: 'error',
//       message:
//         error.response?.data?.message ||
//         'An error occurred during PAN verification.',
//     });
//   }
// };

//Voter
  export const voterIdVerification = async (req, res) => {
    const { id_number } = req.body;
  
    if (!id_number) {
        return res.status(400).json({ error: 'id_number are required' });
    }

     // Check if Voter data already exists in the database
     const existingVoter = await VOTER.findOne({ id_number });
     if (existingVoter) {
         return res.status(200).json({
             status: 'success',
             message: 'Voter Id is already verified.',
             verifiedData: existingVoter.verifiedData, // Returning existing verified data
         });
     }

    const payload = { 
      timestamp: Math.floor(Date.now() / 1000), 
      partnerId: 'CORP0000363', 
      reqid: "748374637" 
    };
    
    const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5'); 
  
    try {
        const response = await axios.post(
            'https://api.verifya2z.com/api/v1/verification/voter_verify',
            { id_number },  
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token,  

                    // 'authorisedkey': authorisedkey,  
                    'accept': 'application/json',
                    'User-Agent': 'CORP0000363', 
  
                },
            }
        );
  
        res.status(200).json(response.data);
        const formatDateAndTime = (isoString) => {
          const date = new Date(isoString);
  
          // Format the date as "DD-MM-YYYY"
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
  
          // Format the time as "hh:mm AM/PM"
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
  
          return { formattedDate, formattedTime };
        };
  
        // Get the current date and time
        const currentDateTime = new Date();
        const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);
  
        // Save the verified PAN details to the database
        const newVoter = new VOTER({
          id_number,
          status: 'verified',
          createdAt: currentDateTime, // ISO timestamp
          formattedDate, // "DD-MM-YYYY"
          formattedTime, // "hh:mm AM/PM"
          verifiedData: response.data, // Store response data in verifiedData field
        });
  
        await newVoter.save();

           // Update the verification count for Voter card in the database
      await updateVerificationCount('voter');
    } catch (error) {
        console.error('Error verifying Voter ID:', error.message);
  
        if (error.response) {
            res.status(error.response.status).json(error.response.data); 
        } else {
            res.status(500).json({ error: 'Internal Server Error' }); 
        }
    }
  };
  
//Verify Passport

  export const passportVerification = async (req, res) => {
    const { id_number, dob } = req.body;

    if (!id_number || !dob) {
        return res.status(400).json({ error: 'refid, id_number, and dob are required' });
    }

     // Check if GST data already exists in the database
     const existingPassport = await Passport.findOne({ id_number });
     if (existingPassport) {
         return res.status(200).json({
             status: 'success',
             message: 'Passport is already verified.',
             verifiedData: existingPassport.verifiedData, // Returning existing verified data
         });
     }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000), 
        partnerId: 'CORP0000363', 
        reqid: "873487378", 
    };

    const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5'); 

    try {
        const response = await axios.post(
          'https://api.verifya2z.com/api/v1/verification/passport_verify',
            { id_number, dob },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token, 
                    // 'authorisedkey': authorisedkey, 
                    'User-Agent': 'CORP0000363', 
                    'accept': 'application/json',  

                },
            }
        );

        res.status(200).json(response.data);

        const formatDateAndTime = (isoString) => {
          const date = new Date(isoString);
  
          // Format the date as "DD-MM-YYYY"
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
  
          // Format the time as "hh:mm AM/PM"
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
  
          return { formattedDate, formattedTime };
        };
  
        // Get the current date and time
        const currentDateTime = new Date();
        const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);
  
        // Save the verified PAN details to the database
        const newPassport = new Passport({
          id_number,
          status: 'verified',
          createdAt: currentDateTime, // ISO timestamp
          formattedDate, // "DD-MM-YYYY"
          formattedTime, // "hh:mm AM/PM"
          verifiedData: response.data, // Store response data in verifiedData field
        });
  
        await newPassport.save();
        // Update the verification count for Voter card in the database
      await updateVerificationCount('passport');
    } catch (error) {
        console.error('Error verifying Passport:', error.message);

        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

//Verify Credit

// export const creditReportCheckController = async (req, res) => {
//   const {name, mobile, document_id, date_of_birth, address, pincode } = req.body;

//   if (!name || !mobile || !document_id || !date_of_birth || !address || !pincode) {
//     return res.status(400).json({ error: 'Missing required fields' });
// }

//   // Check if CREDIT already exists in the database
//   const existingCredit = await CREDIT.findOne({ document_id });
//   if (existingCredit) {
//       return res.status(200).json({
//           status: 'success',
//           message: 'CREDIT is already verified.',
//           verifiedData: existingCredit.verifiedData, // Returning existing verified data
//       });
//   }

//   const payload = {
//       timestamp: Math.floor(Date.now() / 1000),
//       partnerId: 'CORP0000363',
//       reqid: "5436456",
//   };
//   const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5');

//   try {
//       const response = await axios.post(
//           'https://api.verifya2z.com/api/v1/verification/credit_report_checker',
//           { name, mobile, document_id, date_of_birth, address, pincode },
//           {
//               headers: {
//                   'Content-Type': 'application/json',
//                   'Token': token,
//                   // 'authorisedkey': authorisedkey,
//                   'accept': 'application/json',
//                   'User-Agent': 'CORP0000363',
//               },
//           }
//       );

//       res.status(200).json(response.data);

//       const formatDateAndTime = (isoString) => {
//         const date = new Date(isoString);

//         // Format the date as "DD-MM-YYYY"
//         const formattedDate = date.toLocaleDateString('en-GB', {
//           day: '2-digit',
//           month: '2-digit',
//           year: 'numeric',
//         });

//         // Format the time as "hh:mm AM/PM"
//         const formattedTime = date.toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: true,
//         });

//         return { formattedDate, formattedTime };
//       };

//       // Get the current date and time
//       const currentDateTime = new Date();
//       const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

//       // Save the verified CREDIT details to the database
//       const newCredit = new CREDIT({
//         document_id,
//         status: 'verified',
//         createdAt: currentDateTime, // ISO timestamp
//         formattedDate, // "DD-MM-YYYY"
//         formattedTime, // "hh:mm AM/PM"
//         verifiedData: response.data, // Store response data in verifiedData field
//       });

//       await newCredit.save();
//       await updateVerificationCount('credit');
//   } catch (error) {
//       console.error('Error fetching credit report:', error.message);

//       if (error.response) {
//           res.status(error.response.status).json(error.response.data);
//       } else {
//           res.status(500).json({ error: 'Internal Server Error' });
//       }
//   }
// };

// const generateEnquiryId = () => {
//   // Generate random 8-digit number (from 10000000 to 99999999)
//   const middlePart = Math.floor(10000000 + Math.random() * 90000000);

//   // Generate random 2-digit number (from 10 to 99)
//   const suffix = Math.floor(10 + Math.random() * 90);

//   // Combine prefix, middle part, and suffix
//   const enquiryId = `MF${middlePart}_${suffix}`;

//   return enquiryId;
// };Fpan

export const creditReportCheckController = async (req, res) => {
  const {name, mobile, document_id, date_of_birth, address, pincode } = req.body;

  if (!name || !mobile || !document_id || !date_of_birth || !address || !pincode) {
    return res.status(400).json({ error: 'Missing required fields' });
}

 

  try {

     // Check if CREDIT already exists in the database
  const existingCredit = await CREDIT.findOne({ document_id });
  if (existingCredit) {
      return res.status(200).json({
          status: 'success',
          message: 'CREDIT is already verified.',
          verifiedData: existingCredit.verifiedData, // Returning existing verified data
          formattedTime :existingCredit.formattedDate,
          formattedDate :existingCredit.formattedTime
      });
  }

  const generateEnquiryId = () => {
    // Generate random 8-digit number (from 10000000 to 99999999)
    const middlePart = Math.floor(10000000 + Math.random() * 90000000);
  
    // Generate random 2-digit number (from 10 to 99)
    const suffix = Math.floor(10 + Math.random() * 90);
  
    // Combine prefix, middle part, and suffix
    const enquiryId = `MF${middlePart}_${suffix}`;
  
    return enquiryId;
  };

   // Generate a new enquiry ID
   const enquiryId = generateEnquiryId();

  const payload = {
      timestamp: Math.floor(Date.now() / 1000),
      partnerId: 'CORP0000363',
      reqid: "5436456",
  };
  const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5');
      const response = await axios.post(
          'https://api.verifya2z.com/api/v1/verification/credit_report_checker',
          { name, mobile, document_id, date_of_birth, address, pincode },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Token': token,
                  // 'authorisedkey': authorisedkey,
                  'accept': 'application/json',
                  'User-Agent': 'CORP0000363',
              },
          }
      );

      if (response.data.statuscode === 200 && response.data.status === true) {
        console.log(response.data);
        const formatDateAndTime = (isoString) => {
          const date = new Date(isoString);
  
          // Format the date as "DD-MM-YYYY"
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
  
          // Format the time as "hh:mm AM/PM"
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
  
          return { formattedDate, formattedTime };
        };
  
        // Get the current date and time
        const currentDateTime = new Date();
        const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

        // Save the verified CREDIT details to the database
      const newCredit = new CREDIT({
        document_id,
        status: 'verified',
        createdAt: currentDateTime,
        formattedDate, 
        formattedTime,
        enquiryId, 
        verifiedData: response.data, 
      });
  
        await newCredit.save();
        await updateVerificationCount('credit');
  
        return res.status(200).json({
          status: 'success',
          message: response.data.message || 'CREDIT verified successfully.',
          verifiedData:response.data,
          formattedDate,
          formattedTime
        });
      } else {
        return res.status(400).json({
          status: 'error',
          message:
            response.data.message || 'CREDIT verification failed. Invalid details.',
        });
      }


    

      

      
  } catch (error) {
      console.error('Error fetching credit report:', error.message);

      if (error.response) {
          res.status(error.response.status).json(error.response.data);
      } else {
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
};




// GST Verification
export const gstVerifyController = async (req, res) => {
    const {  id_number } = req.body;

    if (typeof id_number === 'undefined') {
      return res.status(400).json({
          error: 'Missing required fields: id_number are mandatory.',
      });
  }

      // Check if GST data already exists in the database
      const existingGst = await GST.findOne({ id_number });
      if (existingGst) {
          return res.status(200).json({
              status: 'success',
              message: 'GST Card is already verified.',
              verifiedData: existingGst.verifiedData, // Returning existing verified data
          });
      }
        

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: 'CORP0000363',
        reqid: "7767267",
    };
    

    const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5'); 

    try {
        const apiPayload = {
            id_number,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            // 'authorisedkey': authorisedkey,
            'accept': 'application/json',
            'User-Agent': 'CORP0000363',
        };
        

        const response = await axios.post(
          'https://api.verifya2z.com/api/v1/verification/gst_verify',
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);
         // Format date and time
      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        // Format the date as "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Format the time as "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      // Get the current date and time
      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified PAN details to the database
      const newGst = new GST({
        id_number,
        status: 'verified',
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
        verifiedData: response.data, // Store response data in verifiedData field
      });

      await newGst.save();
      
      // Update the verification count for PAN card in the database
      await updateVerificationCount('gst');
    } catch (error) {
        console.error('Error during GST verification:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};



//Udyam Aadhaar verification
export const udyamAadhaarVerifyController = async (req, res) => {
    const { udyam_aadhaar } = req.body;

    if (!udyam_aadhaar) {
        return res.status(400).json({ error: 'Missing required fields: refid and udyam_aadhaar are mandatory.' });
    }
      // Check if GST data already exists in the database
      const existingUdyam = await Udyam.findOne({ udyam_aadhaar });
      if (existingUdyam) {
          return res.status(200).json({
              status: 'success',
              message: 'Udyam Aadhaar is already verified.',
              verifiedData: existingUdyam.verifiedData, // Returning existing verified data
          });
      }

    const payload = {
        timestamp: Math.floor(Date.now() / 1000),
        partnerId: 'CORP0000363',
        reqid: "37659138",
    };

    const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5');

    try {
        const apiPayload = {
            udyam_aadhaar
        };

        const headers = {
            'Content-Type': 'application/json',
            'Token': token,
            // 'authorisedkey': authorisedkey, 
            'accept': 'application/json',
            'User-Agent': 'CORP0000363'
        };

        const response = await axios.post(
          'https://api.verifya2z.com/api/v1/verification/udyam_aadhaar_verify_v2',
            apiPayload,
            { headers }
        );

        res.status(200).json(response.data);

         // Format date and time
      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        // Format the date as "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Format the time as "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      // Get the current date and time
      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified PAN details to the database
      const newUdyam = new Udyam({
        udyam_aadhaar,
        status: 'verified',
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
        verifiedData: response.data, // Store response data in verifiedData field
      });

      await newUdyam.save();
        // Update the verification count for PAN card in the database
      await updateVerificationCount('udyancard');
    } catch (error) {
        console.error('Error during Udyam Aadhaar verification:', error.message);

        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};




// PAN details verification
export const panDetailedInfoGetController = async (req, res) => {
  const { id_number } = req.body; // Using idnumber as per your schema

  if (!id_number) {
      return res.status(400).json({ error: 'Missing required fields: idnumber is mandatory.' });
  }

  // Check if PAN detail already exists in the database
  const existingPanDetail = await PanDetail.findOne({ id_number }); // Searching with idnumber
  if (existingPanDetail) {
      return res.status(200).json({
          status: 'success',
          message: 'Pan Detail is already verified.',
          verifiedData: existingPanDetail.verifiedData, // Returning existing verified data
      });
  }

  const payload = {
      timestamp: Math.floor(Date.now() / 1000),
      partnerId: 'CORP0000363',
      reqid: "123456",
  };

  const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5');

  try {
      const apiPayload = {
          id_number // Sending the idnumber as payload
      };



      const headers = {
          'Content-Type': 'application/json',
          'Token': token,
          'accept': 'application/json',
          'User-Agent': 'CORP0000363',
      };
      
      

      const response = await axios.post('https://api.verifya2z.com/api/v1/verification/pandetails_verify', apiPayload, { headers });

      if (response.data.statuscode === 200 && response.data.status === true) {
          console.log(response.data);


          // Format date and time
          const formatDateAndTime = (isoString) => {
              const date = new Date(isoString);

              // Format the date as "DD-MM-YYYY"
              const formattedDate = date.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
              });

              // Format the time as "hh:mm AM/PM"
              const formattedTime = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
              });

              return { formattedDate, formattedTime };
          };

          // Get the current date and time
          const currentDateTime = new Date();
          const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

          // Save the verified PAN details to the database
          const newPanDetail = new PanDetail({
              id_number, // Save idnumber field in the database
              status: 'verified',
              verifiedData: response.data, // Store response data in verifiedData field
              createdAt: currentDateTime, // ISO timestamp
              formattedDate, // "DD-MM-YYYY"
              formattedTime, // "hh:mm AM/PM"
          });

          await newPanDetail.save();

          // Update the verification count for PAN Detail in the database
          await updateVerificationCount('pandetail');


          return res.status(200).json({
              status: 'success',
              message: response.data.message || 'PAN Card verified successfully.',
              verifiedData: response.data,
          });
      } else {
          return res.status(400).json({
              status: 'error',
              message: response.data.message || 'PAN Detail verification failed. Invalid details.',
          });
      }
  } catch (error) {
      console.error('Error during PAN details verification:', error.message);

      if (error.response) {
          res.status(error.response.status).json({ error: error.response.data });
      } else {
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
};


//Get Count

// Fetch current verification counts
export const getVerificationCounts = async (req, res) => {
  try {
    const countData = await VerificationCount.findOne();
    if (!countData) {
      return res.status(404).json({ error: 'Verification count data not found' });
    }
    res.status(200).json(countData);
  } catch (error) {
    console.error('Error fetching verification counts:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const verifyPanCardController = async (req, res) => {
  const { pannumber } = req.body;

  if (!pannumber) {
    return res.status(400).json({
      status: 'error',
      message: 'PAN number is required',
    });
  }

  try {
    // Check if PAN data already exists in the database
    const existingPan = await Pan.findOne({ pannumber });
    if (existingPan) {
      return res.status(200).json({
        status: 'success',
        message: 'PAN Card is already verified.',
        verifiedData: existingPan.verifiedData, // Returning existing verified data
      });
    }

    // Generate token for the verification API
    const token = createToken();
    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Unable to generate token for verification',
      });
    }

    // Make the API request to verify PAN card
    const response = await axios.post(
      'https://api.verifya2z.com/api/v1/verification/pan_verify',
      { pannumber },
      {
        headers: {
          Token: token,
          'User-Agent': 'CORP0000363',
        },
      }
    );

    // If the PAN verification is successful
    if (response.data.statuscode === 200 && response.data.status === true) {
      console.log(response.data);
      const { full_name, pan_number } = response.data.data;

      // Format date and time
      const formatDateAndTime = (isoString) => {
        const date = new Date(isoString);

        // Format the date as "DD-MM-YYYY"
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Format the time as "hh:mm AM/PM"
        const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        return { formattedDate, formattedTime };
      };

      // Get the current date and time
      const currentDateTime = new Date();
      const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

      // Save the verified PAN details to the database
      const newPan = new Pan({
        pannumber: pan_number,
        status: 'verified',
        verifiedData: {
          full_name,
          pan_number,
        },
        createdAt: currentDateTime, // ISO timestamp
        formattedDate, // "DD-MM-YYYY"
        formattedTime, // "hh:mm AM/PM"
      });

      await newPan.save();

      // Update the verification count for PAN card in the database
      await updateVerificationCount('pancard');

      req.body.verifiedData = { full_name, pan_number };

      return res.status(200).json({
        status: 'success',
        message: response.data.message || 'PAN Card verified successfully.',
        verifiedData: { full_name, pan_number },
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message:
          response.data.message || 'PAN verification failed. Invalid details.',
      });
    }
  } catch (error) {
    console.error('PAN Verification Error:', error);

    return res.status(500).json({
      status: 'error',
      message:
        error.response?.data?.message ||
        'An error occurred during PAN verification.',
    });
  }
};

// Helper function to update the verification count
export const updateVerificationCount = async (verificationType) => {
  try {
    // Fetch the current verification count data from the database
    const countData = await VerificationCount.findOne();

    if (!countData) {
      // If no count data exists, create a new one with the given verification type
      const newCountData = new VerificationCount({
        [verificationType]: 1,
      });
      await newCountData.save();
    } else {
      // If the count data exists, increment the count for the specified verification type
      countData[verificationType] += 1;
      await countData.save();
    }
  } catch (error) {
    console.error('Error updating verification count:', error.message);
  }
};



//CREDIT TODAY

export const creditReportCheck = async (req, res) => {
  const { fname, lname, phone_number, pan_num, date_of_birth } = req.body;

  if (!fname || !lname || !phone_number || !pan_num || !date_of_birth) {
    return res.status(400).json({ error: 'All fields are required: fname, lname, phone_number, pan_num, date_of_birth' });
  }

  const reqid = `REQ-${Math.floor(Date.now() / 1000)}`; // Generate a unique reqid
  const payload = {
    timestamp: Math.floor(Date.now() / 1000),
    partnerId: 'CORP0000363',
    reqid: reqid, // Include reqid in the payload
  };
  const token = jwt.sign(payload, 'UTA5U1VEQXdNREF6TmpOUFZHc3lUMVJuZWs1cVFYbE5VVDA5');

  try {
    console.log('Outgoing request:', {
      fname,
      lname,
      phone_number,
      pan_num,
      date_of_birth,
    });

    const response = await axios.post(
      Check,
      { fname, lname, phone_number, pan_num, date_of_birth },
      {
        headers: {
          'Content-Type': 'application/json',
          'Token': token,
          'accept': 'application/json',
          'User-Agent': 'CORP0000363',
          reqid: reqid, // Include reqid in headers if required
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching credit report:', error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};



export const getVerifiedUsers = async (req, res) => {
  try {
    // Get the clientId from the query parameter
    const { aadharNumber } = req.body;

    // If clientId is not provided, return an error message
    if (!aadharNumber) {
      return res.status(400).json({ message: 'Client ID is required' });
    }

    // Fetch verified users for the given clientId
    const verifiedUsers = await Adhar.find({
      aadharNumber: aadharNumber,
      status: 'verified',
    });

    // If no verified users are found, return a 404 message
    if (!verifiedUsers || verifiedUsers.length === 0) {
      return res.status(404).json({ message: 'No verified users found for this clientId' });
    }

    // Return the found verified users
    return res.status(200).json({verifiedUsers});
  } catch (error) {
    console.error('Error fetching verified users:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


//Create New User


// Create Bank User Controller
export const createBankController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if any user already exists
    const existingUser = await BankUser.findOne();
    let role = 'user'; // Default role for subsequent users

    if (!existingUser) {
      role = 'admin'; // Assign admin role to the first registered user
    } else {
      const userExists = await BankUser.findOne({ bankName: req.body.bankName, email: req.body.email });
      if (userExists) {
        return res.status(200).json({
          status: 'success',
          message: 'Bank is already verified.',
        });
      }
    }
    console.log("Request body:", req.body);
    // if (existingUser) {
    //   return res.status(400).json({ error: "Only one user registration is allowed." });
    // }

    // Generate a unique user ID and password
const userId = `BANK-${Date.now()}`; // Generate a unique user ID based on timestamp
const rawPassword = Math.random().toString(36).slice(-8); // Generate a random 8-character password

    // Hash the generated password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const formatDateTime = (date) => {
      // Format the date as DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`; // Format as DD/MM/YYYY
    
      // Format the time as 12-hour format with AM/PM
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? String(hours).padStart(2, '0') : '12'; // Handle 12 AM/PM case
      
      const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`; // Format as HH:MM:SS AM/PM
    
      return {
        date: formattedDate, // Return the formatted date
        time: formattedTime, // Return the formatted time
      };
    };
    
    
    
    // Example usage
    const currentDate = new Date();
    const { date, time } = formatDateTime(currentDate);

    // Create new user
    const user = await BankUser.create({
      bankName: req.body.bankName,
      noOfBranches: req.body.noOfBranches,
      address: req.body.address,
      totalTurnover: req.body.totalTurnover,
      state: req.body.state,
      email: req.body.email,
      role, // Assign role to the user
      projectOfficer: req.body.projectOfficer,
      dateOfAdmission: date, // Automatically set to the current date
      TimeOfAdmission: time, // Automatically set to the current date
      registrationNo: req.body.registrationNo,
      contactPerson: req.body.contactPerson,
      mobile: req.body.mobile,
      district: req.body.district,
      taluka: req.body.taluka,
      pinCode: req.body.pinCode,
      userId: userId, // Automatically generated userId
      password: hashedPassword, // Automatically hashed password
    });


    // Create the Credentials entry with the userId and hashedPassword
    await Credentials.create({
      bankName: req.body.bankName,
      email: req.body.email,
      userId: userId,
      role, // Assign role to the user
      password: hashedPassword,
      RegisterDate:date,
      RegisterTime:time
    });


    // Send email with user ID and password
    const transporter = nodemailer.createTransport({
      service: "gmail", // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER || "jiteshavs45@gmail.com", // Use environment variables for security
        pass: process.env.EMAIL_PASS || "lvtwexgczivtnxvq", // Use environment variables for security
      },
    });

    const mailOptions = {
      from: req.body.email, // Use user-entered email
      to: req.body.email,
      subject: "Your Bank User Registration Details",
      text: `Dear ${req.body.contactPerson},\n\nYour registration was successful. Below are your login credentials:\n\nUser ID: ${userId}\nPassword: ${rawPassword}\n\nPlease use these credentials to log in to your account.\n\nRegards,\nBank Team`,
    };

    await transporter.sendMail(mailOptions);

    const data = { id: user.id };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({
      message: "User registered successfully. Login credentials sent to the provided email.",
      authToken,
      role
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


//LoginBank

export const loginBankController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, password } = req.body;

  try {
    // Find the credentials associated with the given userId
    const credentials = await Credentials.findOne({ userId });

    if (!credentials) {
      return res.status(400).json({ error: "Invalid user ID or user doesn't exist." });
    }


    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, credentials.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password." });
    }

    // Fetch the associated BankUser details using the userId
    const user = await BankUser.findOne({ userId });

    if (!user) {
      return res.status(400).json({ error: "No associated bank user found." });
    }


    const data = { id: credentials.id };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({
      message: "Login successful.",
      authToken,
      role: user.role
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};





const MY_EMAIL="jiteshavs45@gmail.com"
const MY_PASSWORD="lvtwexgczivtnxvq"

// Email-sending function using Nodemailer
function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MY_EMAIL, // Gmail email address
        pass: MY_PASSWORD, // App password (if 2FA is enabled)
      },
    });

    const mail_configs = {
      from: MY_EMAIL,
      to: recipient_email,
      subject: "AVS Verify PASSWORD RECOVERY",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Password Recovery</title>
        </head>
        <body>
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">AVS Verify</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
              <p style="font-size:0.9em;">Regards,<br />AVS Verify</p>
            </div>
          </div>
        </body>
        </html>`
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.error(error);
        return reject({ message: `An error occurred: ${error.message}` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}


// Route 3: Send OTP for password recovery
// Example route for sending OTP to the user's email
// Route for sending recovery email
export const sendBankEmail = async (req, res) => {
  const { userId } = req.body;

  // Generate a random OTP (for example, a 6-digit number)
  const otp = Math.floor(100000 + Math.random() * 900000);

  // OTP expires in 10 minutes
  const otpExpiration = Date.now() + 10 * 60 * 1000;

  try {
    // Find the user by userId
    const user = await Credentials.findOne({ userId });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Retrieve email from the user's record
    const email = user.email;

    // Log the user document before updating
    console.log("User before OTP update:", user);

    // Update the OTP and OTP expiration in the user document
    user.otp = otp;
    user.otpExpiration = otpExpiration;

    // Log the OTP and expiration time before saving
    console.log("Updating OTP:", otp);
    console.log("OTP Expiration:", otpExpiration);

    // Save the updated user document
    await user.save();

    // Log the user document after updating
    console.log("User after OTP update:", await Credentials.findOne({ userId }));

    // Send OTP via email (using nodemailer, for example)
    sendEmail({ recipient_email: email, OTP: otp })
      .then(() => {
        res.status(200).json({ message: 'OTP sent to your email.' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP.' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Route for verifying OTP and changing password
export const VerifyBankOTP = async (req, res) => {
  const { userId, otp, newPassword } = req.body;

  try {
    // Find the user by userId
    const user = await Credentials.findOne({ userId });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Log OTP and expiration time for debugging
    console.log('Stored OTP:', user.otp);
    console.log('OTP Expiration:', user.otpExpiration);
    console.log('Current Time:', Date.now());

    // Check if OTP matches and is still valid
    if (user.otp === otp && user.otpExpiration > Date.now()) {
      // Update the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpiration = null;

      // Save the updated user document
      await user.save();

      res.status(200).json({ message: 'Password successfully updated.' });
    } else {
      res.status(400).json({ message: 'Invalid OTP or OTP expired.' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// export const getBank = async (req, res) => {
//   try {
//     // Ensure `req.user` is populated by the `fetchuser` middleware
//     const email = req.user.email; // Assuming `email` is in the token payload

//     // Find the user by email
//     const user = await Credentials.findOne({ userId });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Send the user data as a response
//     res.json(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

export const getBank = async (req, res) => {
  try {
    console.log("User ID from req.user:", req.user); // Debug log
    const userId = req.user.id; // Extracted from JWT payload
    const user = await Credentials.findById(userId); // Find user by _id
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user); // Send the user object in response
  } catch (error) {
    console.error("Error in getBank:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllBanks = async (req, res) => {
  try {
    console.log("User ID from req.user:", req.user); // Debug log
    // You can still use req.user to access the authenticated user information, if needed
    
    // Fetch all banks (all documents in the Credentials collection)
    const banks = await Credentials.find(); 
    
    if (!banks || banks.length === 0) {
      return res.status(404).json({ error: "No banks found" });
    }

    res.json(banks); // Send all banks as response
  } catch (error) {
    console.error("Error in getAllBanks:", error.message);
    res.status(500).send("Internal Server Error");
  }
};


// Controller to create a new branch
export const createNewBranch = async (req, res) => {
  try {
    const { bankId, bankName, srNo, branchName } = req.body;

    // Validate the input fields
    if (!bankId || !bankName || !srNo || !branchName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingBranch = await BRANCH.findOne({ bankName });
    if (existingBranch) {
      return res.status(200).json({
        status: 'success',
        message: 'Branch is already created.',
        verifiedData: existingBranch.verifiedData, // Returning existing verified data
      });
    }

    // Format date and time
    const formatDateAndTime = (isoString) => {
      const date = new Date(isoString);

      // Format the date as "DD-MM-YYYY"
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Format the time as "hh:mm AM/PM"
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return { formattedDate, formattedTime };
    };

    // Get the current date and time
    const currentDateTime = new Date();
    const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

    // Create a new branch instance
    const newBranch = new BRANCH({
      bankId,
      bankName,
      srNo,
      branchName,
      formattedDate, // "DD-MM-YYYY"
      formattedTime, // "hh:mm AM/PM"
    });

    // Save the branch to the database
    await newBranch.save();

    res.status(201).json({ message: 'Branch created successfully', branch: newBranch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// export const CreateBranchUser = async (req, res) => {
//   const { userId, branchId, mobileNumber, password, userName, branchName, email, confirmPassword } = req.body;

//   // Basic validation
//   if (!userId || !branchId || !mobileNumber || !password || !userName || !branchName || !email || !confirmPassword) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: 'Passwords do not match' });
//   }

//   try {
//     // Check if user already exists
//     const existingBranchUser = await CREATEUSER.findOne({ userId });
//     if (existingBranchUser) {
//       return res.status(200).json({
//         status: 'success',
//         message: 'User is already verified.',
//         verifiedData: existingBranchUser.verifiedData, // Returning existing verified data
//       });
//     }


//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//      // Format date and time
//      const formatDateAndTime = (isoString) => {
//       const date = new Date(isoString);

//       // Format the date as "DD-MM-YYYY"
//       const formattedDate = date.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       });

//       // Format the time as "hh:mm AM/PM"
//       const formattedTime = date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       });

//       return { formattedDate, formattedTime };
//     };

//     // Get the current date and time
//     const currentDateTime = new Date();
//     const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

//     // Create a new user
//     const newBranchUser = new CREATEUSER({
//       userId,
//       branchId,
//       mobileNumber,
//       password: hashedPassword,
//       userName,
//       branchName,
//       email,
//       formattedDate, 
//       formattedTime, 
//     });

//     await newBranchUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


export const CreateBranchUser = async (req, res) => {
  const { branchId, mobileNumber, password, userName, branchName, email, confirmPassword } = req.body;

  // Basic validation
  if (!branchId || !mobileNumber || !password || !userName || !branchName || !email || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
       // Find the last created user
       const lastUser = await CREATEUSER.findOne().sort({ _id: -1 });
       let newUserId = '100001_01'; // Default userId for the first user
   
       if (lastUser) {
         // Extract the numeric part from the last userId and increment it
         const [base, count] = lastUser.userId.split('_');
         const newCount = String(parseInt(count) + 1).padStart(2, '0');
         newUserId = `${base}_${newCount}`;
       }
    // Check if user already exists
    const existingBranchUser = await CREATEUSER.findOne({ branchName });
    if (existingBranchUser) {
      return res.status(200).json({
        status: 'success',
        message: 'User is already verified.',
        verifiedData: existingBranchUser.verifiedData, // Returning existing verified data
      });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

     // Format date and time
     const formatDateAndTime = (isoString) => {
      const date = new Date(isoString);

      // Format the date as "DD-MM-YYYY"
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Format the time as "hh:mm AM/PM"
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return { formattedDate, formattedTime };
    };

    // Get the current date and time
    const currentDateTime = new Date();
    const { formattedDate, formattedTime } = formatDateAndTime(currentDateTime);

    // Create a new user
    const newBranchUser = new CREATEUSER({
      userId: newUserId,
      branchId,
      mobileNumber,
      password: hashedPassword,
      userName,
      branchName,
      email,
      formattedDate, 
      formattedTime, 
    });

    await newBranchUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
