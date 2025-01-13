import mongoose from "mongoose";
const { Schema } = mongoose;

const UserBranchSchema  = new Schema({
  userId: { type: String, required: true, unique: true },
  branchId: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  branchName: { type: String, required: true },
  email: { type: String, required: true },
  formattedDate: {
    type: String,
    required: false, 
  },
  formattedTime: {
    type: String,
    required: false,
  },
});

const userBranchSchema  = mongoose.model("CREATEUSER", UserBranchSchema);
export default userBranchSchema ;
