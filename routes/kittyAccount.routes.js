const { isAuthenticated, isKitty } = require("../middlewares/auth.middlewares");
const KittyAccount = require("../models/kittyAccount");

const router = require("express").Router();

// POST "api/kitty/:userId/create" => Create new account
router.post("/:userId/create", isAuthenticated, async (req, res, next) => {
  const { accountName } = req.body;

  // Name field is not empty
  if (!accountName) {
    return res
      .status(400)
      .json({ errorMessage: "Account Name field is required" });
  }

  try {
    await KittyAccount.create({
      accountName,
      owner: req.params.userId,
      createdBy: req.payload._id,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// GET "api/kitty/:userId/all" => get a list of all accounts of a single user
router.get("/:userId/all", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const accountList = await KittyAccount.find({ owner: userId });
    res.json(accountList);
  } catch (error) {
    next(error);
  }
});

// GET "/api/kitty/:accountId/details" => details of a single account
router.get("/:accountId/details", isAuthenticated, async (req, res, next) => {
  const { accountId } = req.params;

  try {
    const foundAccount = await KittyAccount.findById(accountId).populate(
      "owner",
      "role"
    );

    foundAccount.owner._id.toString() === req.payload._id.toString() ||
    req.payload.role === "admin"
      ? res.json(foundAccount)
      : res.status(401).json();
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/kitty/:accountId/edit" => edit name of account
router.patch(
  "/:accountId/edit",
  isAuthenticated,
  isKitty,
  async (req, res, next) => {
    const { accountId } = req.params;
    const { accountName } = req.body;

    try {
      await KittyAccount.findByIdAndUpdate(accountId, { accountName });

      res.status(202).json();
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/api/kitty/:accountId/add-money" => add money to account balance
router.patch(
  "/:accountId/add-money",
  isAuthenticated,
  isKitty,
  async (req, res, next) => {
    const { accountId } = req.params;
    const { moneyToAdd } = req.body;
    try {
      const accountToUpdate = await KittyAccount.findById(accountId);

      await KittyAccount.findByIdAndUpdate(accountId, {
        balance: accountToUpdate.balance + Number(moneyToAdd * 100),
      });

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
);

// DELETE "/api/kitty/:accountId/delete" => delete a specific account (not the one made by the Admin)
router.delete("/:accountId/delete", isAuthenticated, async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const foundAccount = await KittyAccount.findById(accountId);

    if (foundAccount.createdBy._id.toString() === req.payload._id.toString()) {
      if (foundAccount.balance !== 0) {
        return res
          .status(400)
          .json({ errorMessage: "Balance must be 0 to delete an account" });
      } else {
        await KittyAccount.findByIdAndDelete(accountId);
      }
    } else {
      res.status(400).json({
        errorMessage: "This account must be deleted by your bank manager",
      });
    }

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
