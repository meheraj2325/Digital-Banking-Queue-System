const mongoose = require("mongoose");

const BankBranchSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  location: {
    division: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      additionalInfo: {
          type: String
      }
  },
  branchName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String
  },
  email: {
    type: String,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  updated: { 
    type: Date, 
    default: Date.now
  }
});

const BankBranch = mongoose.model("BankBranch", BankBranchSchema);

module.exports = BankBranch;
