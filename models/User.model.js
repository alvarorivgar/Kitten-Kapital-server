const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    role: {
      type: String,
      enum: ["user", "kitty"],
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dkz1jslyi/image/upload/v1677055585/Plannerly/blank-profile-picture-973460_1280-1-705x705_zz7gvv.png",
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
