const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const {isAuthenticated} = require("../middlewares/auth.middlewares");
const Admin = require("../models/Admin.model");

// POST "/api/auth/login" => Validate user credentials
router.post("/login", async (req, res, next) => {
  const { idNumber, password } = req.body;

  // No fields are empty
  if (!idNumber || !password) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  try {
    // User exists in DB
    const foundUser = await User.findOne({ idNumber: idNumber }) || await Admin.findOne({ idNumber: idNumber }) ;
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
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});


module.exports = router;
