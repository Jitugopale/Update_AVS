import mongoose from "mongoose";
const { Schema } = mongoose;

const UdyamSchema = new Schema({
  udyam_aadhaar: {
    type: String,
    unique: true,
    sparse: true, 
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

const udyamSchema = mongoose.model("Udyam", UdyamSchema);
export default udyamSchema;
