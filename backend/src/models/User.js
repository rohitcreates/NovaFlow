import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar:{
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
},
lastActive: {
    type: Date,
    default: Date.now,
},
isActive: {
    type: Boolean,
    default: true,
  },
},
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);