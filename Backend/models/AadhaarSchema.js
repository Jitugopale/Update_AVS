import mongoose from "mongoose";
const { Schema } = mongoose;

const AadhaarSchema = new Schema({
    date: {
        type: Date,
        default: Date.now, 
    },
    clientId: {
        type: String,
        required: false, 
    },
    OTP: {
        type: Number,
        required: false,
    },
    mobile_number: {
        type: String,
        required: false, // Same for mobile number if you want to store it
    },
    aadharNumber: {
        type: Number,
        required: false, 
        unique: true,
        sparse:true
    },
  status: {
    type: String,
    default: 'pending', 
  },
  verifiedData: {
    type: Object, 
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  formattedDate: {
    type: String,
    required: false, 
  },
  formattedTime: {
    type: String,
    required: false,
  },
});

const adharSchema = mongoose.model("Adhar", AadhaarSchema);
export default adharSchema;
