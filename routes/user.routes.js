const {isAuthenticated, isUserOrKitty} = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");

const router = require("express").Router();

// GET /user => find a user by id
router.get("/:userId", isAuthenticated, isUserOrKitty, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const foundUser = User.findById(userId);
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
});

// PATCH "/user/edit" => edit user details
router.patch("/:userId/edit", isAuthenticated, isUserOrKitty, async (req, res, next) => {
    const { image, email, password} = req.body
    const { userId } = req.params;

    try {
        await User.findByIdAndUpdate(userId, {
            image,
            email,
            password
        })

        res.status(200).json()
    } catch (error) {
        next(error)
    }
})

module.exports = router;
