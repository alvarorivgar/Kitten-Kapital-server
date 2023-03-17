const CheckingAccount = require("../models/checkingAccount");

const CronJob = require("cron").CronJob;

const monthlyFeeJob = new CronJob(
  "10 * * * * *", // seconds, minutes, hours, day of month, month, day of week
  function () {
    applyMonthlyFees();
  },
  null,
  true,
  "America/Los_Angeles"
);

const applyMonthlyFees = async () => {
  try {
    const checkingList = await CheckingAccount.find();

    checkingList.forEach(async (checking) => {
      await CheckingAccount.findByIdAndUpdate(checking.id, {
        balance: (checking.balance -= checking.maintenanceFee),
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = monthlyFeeJob;
