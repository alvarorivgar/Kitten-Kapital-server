const { isAuthenticated, isUser } = require("../middlewares/auth.middlewares");
const CheckingAccount = require("../models/checkingAccount");

const router = require("express").Router();

// POST "api/checking/:userId/create" => Create new account
router.post("/:userId/create", isAuthenticated, async (req, res, next) => {
  const {
    accountName,
    transferFee,
    maintenanceFee,
    minimumBalance,
    penaltyFee,
  } = req.body;

  // Name field is not empty
  if (!accountName) {
    return res
      .status(400)
      .json({ errorMessage: "Account Name field is required" });
  }

  try {
    await CheckingAccount.create({
      accountName,
      owner: req.params.userId,
      transferFee,
      maintenanceFee,
      minimumBalance,
      penaltyFee,
      createdBy: req.payload._id,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// GET "api/checking/:userId/all" => get a list of all accounts of a single user
router.get("/:userId/all", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  try {
    const accountList = await CheckingAccount.find({ owner: userId });
    res.json(accountList);
  } catch (error) {
    next(error);
  }
});

// GET "/api/checking/:accountId/details" => details of a single account
router.get("/:accountId/details", isAuthenticated, async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const foundAccount = await CheckingAccount.findById(accountId).populate(
      "owner",
      "role"
    );

    if (req.payload.role === "kitty") {
      return res.json();
    }
    req.payload.role === "admin" ||
    foundAccount.owner._id.toString() === req.payload._id.toString()
      ? res.json(foundAccount)
      : res.status(401).json();
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/checking/:accountId/edit" => edit name of account
router.patch(
  "/:accountId/edit",
  isAuthenticated,
  isUser,
  async (req, res, next) => {
    const { accountId } = req.params;
    const { accountName } = req.body;

    try {
      await CheckingAccount.findByIdAndUpdate(accountId, { accountName });

      res.status(202).json();
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/api/checking/:accountId/add-money"
router.patch(
  "/:accountId/add-money",
  isAuthenticated,
  isUser,
  async (req, res, next) => {
    const { accountId } = req.params;
    const { moneyToAdd } = req.body;
    try {
      const accountToUpdate = await CheckingAccount.findById(accountId);

      await CheckingAccount.findByIdAndUpdate(accountId, {
        balance: accountToUpdate.balance + Number(moneyToAdd * 100),
      });

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
);

// DELETE "/api/checking/:id/delete" => delete a specific account (not the one made by the Admin)
router.delete("/:accountId/delete", isAuthenticated, async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const foundAccount = await CheckingAccount.findById(accountId).populate(
      "owner",
      "role"
    );

    if (foundAccount.createdBy._id.toString() === req.payload._id.toString()) {
      if (foundAccount.balance !== 0) {
        return res
          .status(400)
          .json({ errorMessage: "Balance must be 0 to delete an account" });
      } else {
        await CheckingAccount.findByIdAndDelete(accountId);
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
