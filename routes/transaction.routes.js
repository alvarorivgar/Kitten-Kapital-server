const {
  isAuthenticated,
  isUserOrKitty,
} = require("../middlewares/auth.middlewares");
const CheckingAccount = require("../models/checkingAccount");
const KittyAccount = require("../models/kittyAccount");
const Transaction = require("../models/Transaction.model");

const router = require("express").Router();

// POST "/transaction/create"
router.post(
  "/create",
  isAuthenticated,
  isUserOrKitty,
  async (req, res, next) => {
    const { origin, destination, amount, subject } = req.body;

    try {
      await Transaction.create({
        origin,
        destination,
        amount,
        subject,
      });
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
);

// GET "/transaction/:accountId/all" => get all transactions of a given account
router.get(
  "/:accountId/all",
  isAuthenticated,
  isUserOrKitty,
  async (req, res, next) => {
    const { accountId } = req.params;

    try {
      const transactionList = await Transaction.find({ origin: accountId, destination: accountId });
      res.json(transactionList);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/transaction/transfer"
router.patch(
  "/transfer",
  isAuthenticated,
  isUserOrKitty,
  async (req, res, next) => {
    const { origin, destination, amount } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ errorMessage: "Please select an account" });
    } if (amount <= 0){
      return res.status(400).json({ errorMessage: "Please select a valid amount" });
    }
    console.log(destination);

    try {
      const sender =
        (await CheckingAccount.findById(origin)) ||
        (await KittyAccount.findById(origin));

      const receiver =
        (await CheckingAccount.findById(destination)) ||
        (await KittyAccount.findById(destination));

      console.log("hola amigo receiver", receiver);

      // User can only transfer money from their own accounts
      if (sender.owner._id.toString() !== req.payload._id.toString()) {
        return res.status(400).json();
      }

      // Amount cannot be greater than current balance
      if (sender.balance < amount) {
        return res.status(400).json({ errorMessage: "Insufficient funds" });
      }

      // Check if receiver account exists
      if (!receiver) {
        return res.status(400).json({ errorMessage: "Account not found" });
      }

      // Reduce sender account balance
      (await CheckingAccount.findByIdAndUpdate(origin, {
        balance: sender.balance - Number(amount),
      })) ||
        (await KittyAccount.findByIdAndUpdate(origin, {
          balance: sender.balance - Number(amount),
        }));

      // Increase receiver account balance
      (await CheckingAccount.findByIdAndUpdate(destination, {
        balance: receiver.balance + Number(amount),
      })) ||
        (await KittyAccount.findByIdAndUpdate(destination, {
          balance: receiver.balance + Number(amount),
        }));

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
