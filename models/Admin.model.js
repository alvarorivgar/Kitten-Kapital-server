const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    idNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    role: {
        type: String,
        default: "admin"
    },
    fullName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Admin = model("Admin", adminSchema);

module.exports = Admin;
