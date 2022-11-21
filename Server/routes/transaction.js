const express = require("express");
const transactionControllers = require("../controllers/transaction.js");
const verify = require("../utils/verifyToken.js");
const router = express.Router();

router.get("/balance", transactionControllers.balance);

router.get("/earnings", transactionControllers.earnings);

router.get("/count", transactionControllers.countByTrans);

router.get(
  "/latest",
  verify.verifyAdmin,
  transactionControllers.getLatestTransaction
);

router.get("/:userName", transactionControllers.getTransactionToUser);

router.get("/", verify.verifyAdmin, transactionControllers.getTransaction);

router.post("/", transactionControllers.createTransaction);

module.exports = router;
