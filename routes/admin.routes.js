const {isAuthenticated, isAdmin} = require("../middlewares/auth.middlewares");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const Admin = require("../models/Admin.model");


// Solo para pruebas
router.post("/create-admin", async (req, res, next) => {
  const { idNumber, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Admin.create({
      idNumber,
      password: hashedPassword,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// POST "/api/admin/create-user" => create new user
router.post("/create-user", isAuthenticated, isAdmin, async (req, res, next) => {
  const { firstName, lastName, email, idNumber, dob, password1, password2 } =
    req.body;

  // No fields are empty
  if (
    !firstName ||
    !lastName ||
    !email ||
    !idNumber ||
    !dob ||
    !password1 ||
    !password2
  ) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  // Passwords match
  if (password1 !== password2) {
    return res.status(400).json({ errorMessage: "Passwords do not match" });
  }

  // Password is secure
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (passwordRegex.test(password1) === false) {
    return res.status(400).json({
      errorMessage:
        "Password must be at least 8 characters long, include upper case letters and a special character",
    });
  }

  // ID format is correct
  const idNumberRegex = /^(x?\d{8}|[xyz]\d{7})[trwagmyfpdxbnjzsqvhlcke]$/i;
  if (idNumberRegex.test(idNumber) === false) {
    return res.status(400).json({ errorMessage: "Invalid ID format" });
  }

  try {
    // ID Number does not exist in DB
    const foundIdNumber = await User.findOne({ idNumber: idNumber });
    if (foundIdNumber) {
      return res.status(400).json({ errorMessage: "ID already exists" });
    }

    // Email does not exist in DB
    const foundEmail = await User.findOne({ email: email });
    if (foundEmail) {
      return res.status(400).json({ errorMessage: "Email already exists" });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password1, salt);

    // Assign role depending on user age

    // We calculate the number of milliseconds and add 1970 since Date.now() returns the number of miliseconds passed since 01/01/1970
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;
    const currentYear = Math.round(Date.now() / year + 1970);
    const formattedDob = new Date(dob);

    formattedDob.getFullYear() + 25 > currentYear
      ? (role = "kitty")
      : (role = "user");

    // Create user
    await User.create({
      firstName,
      lastName,
      email,
      idNumber,
      dob,
      password: hashedPassword,
      role,
      manager: req.payload._id,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// DELETE USER

module.exports = router;
