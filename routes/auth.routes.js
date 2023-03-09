const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

// POST "/api/auth/signup" => Create user in BD
router.post("/signup", async (req, res, next) => {
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
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => Validate user credentials
router.post("/login", async (req, res, next) => {
  const { idNumber, password } = req.body;

  // No fields are empty
  if (!idNumber || !password) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  try {
    // User exists in DB
    const foundUser = await User.findOne({ idNumber: idNumber });
    if (!foundUser) {
      return res.status(400).json({ errorMessage: "Invalid credentials" });
    }

    // Password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ errorMessage: "Invalid credentials" });
    }

    const payload = {
      _id: foundUser._id,
      idNumber: foundUser.idNumber,
      role: foundUser.role,
    };

    // Generate token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Verify if user is active
router.get("/verify", (req, res, next) => {
    res.status(200).json(req.payload)
})

module.exports = router;
