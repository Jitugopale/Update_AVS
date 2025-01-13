import mongoose from "mongoose";
const { Schema } = mongoose;

const VerificationCountSchema = new Schema({
  pancard: { type: Number, default: 0 },
  aadhar: { type: Number, default: 0 },
  udyancard: { type: Number, default: 0 },
  pandetail: { type: Number, default: 0 },
  voter: { type: Number, default: 0 },
  passport: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
}, { timestamps: true });

const verifycount = mongoose.model("VerificationCount", VerificationCountSchema);
export default verifycount;
