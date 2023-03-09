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
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    transferFee: {
      type: Number,
      default: 5,
    },
    maintenanceFee: {
      //BONUS
      type: Number,
      default: 2,
    },
    minimumBalance: {
      //BONUS
      type: Number,
      default: 50,
    },
    penaltyFee: {
      //BONUS
      type: Number,
      default: 10,
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
