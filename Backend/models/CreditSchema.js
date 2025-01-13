import mongoose from "mongoose";
const { Schema } = mongoose;

const CreditSchema = new Schema({
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
  name: {
    type: String,
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true
  },
  document_id: {
    type: String,
    unique: true,
    sparse: true
  },
  date_of_birth: {
    type: Date,
  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  enquiryId:{
    type:String,
  }

 
});

const creditSchema = mongoose.model("CREDIT", CreditSchema);
export default creditSchema;
