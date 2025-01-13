import mongoose from "mongoose";
const { Schema } = mongoose;

const VoterSchema = new Schema({
  id_number: {
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

const voterSchema = mongoose.model("VOTER", VoterSchema);
export default voterSchema;
