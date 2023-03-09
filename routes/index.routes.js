const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Auth routes

router.use("/auth", require("./auth.routes"))

// Admin routes

router.use("/admin", require("./admin.routes"))

// Kitty account routes

router.use("/kitty", require("./kittyAccount.routes"))

// Checking account routes

router.use("/checking", require("./checkingAccount.routes"))

// Transaction routes

router.use("/transaction", require("./transaction.routes"))

module.exports = router;
