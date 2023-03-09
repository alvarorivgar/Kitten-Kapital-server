const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    origin: {
      type: Schema.Types.ObjectId,
      refPath: "model_type",
      model_type: {
        type: String,
        enum: ["CheckingAccount", "KittyAccount"],
      },
    },
    destination: {
      type: Schema.Types.ObjectId,
      refPath: "model_type",
      model_type: {
        type: String,
        enum: ["CheckingAccount", "KittyAccount"],
      },
    },
    amount: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
