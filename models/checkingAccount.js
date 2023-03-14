const { Schema, model } = require("mongoose");

const checkingAccountSchema = new Schema(
  {
    accountName: {
      type: String,
      trim: true,
      default: "Checking account",
    },
    balance: {
      type: Number,
      default: 0, // Value is counted in cents
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transferFee: {
      type: Number,
      default: 500,
    },
    maintenanceFee: {
      type: Number,
      default: 200,
    },
    minimumBalance: {
      //BONUS
      type: Number,
      default: 500,
    },
    penaltyFee: {
      //BONUS
      type: Number,
      default: 100,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: "model_type",
      model_type: {
        type: String,
        enum: ["User", "Admin"],
      }
    },
  },
  {
    timestamps: true,
  }
);

const CheckingAccount = model("CheckingAccount", checkingAccountSchema);

module.exports = CheckingAccount;
