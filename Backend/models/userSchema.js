import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    Lname: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    PhoneNo: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Ensure it's a 10-digit number
      },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, 
    },
    
});

const userSchema = mongoose.model("user", UserSchema);
export default userSchema;
