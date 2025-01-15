import mongoose from "mongoose";
const { Schema } = mongoose;

const BankUserSchema = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  noOfBranches: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  totalTurnover: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  projectOfficer: {
    type: String,
    required: true,
  },
  dateOfAdmission: {
    type: String, // Now stored as a string (DD/MM/YYYY)
    required: true,
  },
  // Add TimeOfAdmission as String (HH:MM:SS)
  TimeOfAdmission: {
    type: String, // Now stored as a string (HH:MM:SS)
    required: true,
  },
  registrationNo: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  taluka: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  newPassword:{
    type: String,
  },
  resetPasswordToken: {
    type: String
},
resetPasswordExpires: {
    type: Date
},
otp: { 
    type: String,
    default: null,
  },
otpExpiration: { 
type: Date,
default: null,
},
role: {  // Add role field
  type: String,
  enum: ['admin', 'user'],
  default: 'user', // Default role is 'user'
  required: true,
},
});

const BankUser = mongoose.model("BankUser", BankUserSchema);
export default BankUser;
