import mongoose from "mongoose";
const { Schema } = mongoose;

const PassportSchema = new Schema({
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

const passportSchema = mongoose.model("Passport", PassportSchema);
export default passportSchema;
