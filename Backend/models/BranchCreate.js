import mongoose from "mongoose";
const { Schema } = mongoose;

const BranchSchema  = new Schema({
    bankId: {
        type: String,
        required: true
      },
      bankName: {
        type: String,
        required: true
      },
      srNo: {
        type: Number,
        required: true
      },
      branchName: {
        type: String,
        required: true
      },
      formattedDate: {
        type: String,
      },
      formattedTime: {
        type: String,
      },
});

const branchSchema  = mongoose.model("BRANCH", BranchSchema);
export default branchSchema ;
