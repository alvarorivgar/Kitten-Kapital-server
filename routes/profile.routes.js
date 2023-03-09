const {isAuthenticated, isUserOrKitty} = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");

const router = require("express").Router();

// GET /profile => show user private profile
router.get("/", isAuthenticated, isUserOrKitty, async (req, res, next) => {
  const { _id } = req.payload;

  try {
    const foundUser = User.findById(_id);
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
});

// PATCH "/profile/edit"
router.patch("/edit", isAuthenticated, isUserOrKitty, async (req, res, next) => {
    const { image, email, password} = req.body
    const { _id } = req.payload;

    try {
        await User.findByIdAndUpdate(_id, {
            image,
            email,
            password
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router;
