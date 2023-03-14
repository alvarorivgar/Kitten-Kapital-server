const { Schema, model } = require("mongoose");

const kittyAccountSchema = new Schema(
  {
    accountName: {
      type: String,
      trim: true,
      default: "Kitty account",
    },
    balance: {
      type: Number,
      default: 0, // Value is counted in cents
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const KittyAccount = model("KittyAccount", kittyAccountSchema);

module.exports = KittyAccount;
