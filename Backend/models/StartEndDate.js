import mongoose from "mongoose";
const { Schema } = mongoose;

const StartEndDate = new Schema({
    aadharNumber: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: "verified",
      },
      verificationDate: {
        type: Date,
        required: true,
      },
});

const startEndDate = mongoose.model("Start", StartEndDate);
export default startEndDate;
