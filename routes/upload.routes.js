const router = require("express").Router();

const uploader = require("../middlewares/cloudinary.config.js");

// POST "/api/upload"
router.post("/", uploader.single("image"), (req, res, next) => {

  if (!req.file) {
    next("No file uploaded!");
    return;
  }

  res.json({ image: req.file.path });
});

module.exports = router;