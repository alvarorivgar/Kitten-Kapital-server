const {
  isAuthenticated,
  isUserOrKitty,
} = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const router = require("express").Router();

// GET "/user/:userId"=> find a user by id
router.get("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const foundUser = await User.findById(userId).populate(
      "manager",
      "fullName"
    );
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
});

// PATCH "/user/:userId/edit-email" => edit user email
router.patch(
  "/:userId/edit-email",
  isAuthenticated,
  isUserOrKitty,
  async (req, res, next) => {
    const { email } = req.body;
    const { userId } = req.params;

    try {
      // Email does not exist in DB
      const foundEmail = await User.findOne({ email: email });
      if (foundEmail) {
        return res.status(400).json({ errorMessage: "Email already exists" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          email,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/user/:userId/edit-password" => edit user password
router.patch(
  "/:userId/edit-password",
  isAuthenticated,
  isUserOrKitty,
  async (req, res, next) => {
    const { password1, password2 } = req.body;
    const { userId } = req.params;

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

    try {
      // Encrypt password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password1, salt);

      await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/user/:userId/edit-image" => edit user image
router.patch(
  "/:userId/edit-image",
  isAuthenticated,
  isUserOrKitty,
  async (req, res, next) => {
    const { image } = req.body;
    const { userId } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          image,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
