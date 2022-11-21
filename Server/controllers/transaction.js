const mongoose = require("mongoose");

const Transaction = require("../models/Transaction.js");
const Hotel = require("../models/Hotel");

exports.createTransaction = async (req, res, next) => {
  const { hotels, ...others } = req.body;
  const hotelId = mongoose.Types.ObjectId(hotels);
  const hotel = await Hotel.findById(hotelId);
  const transaction = new Transaction({
    hotelId: hotelId,
    hotel: hotel.name,
    ...others,
  });

  try {
    const savedTransaction = await transaction.save();
    res.status(200).json(savedTransaction);
  } catch (err) {
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.getLatestTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    const latestTrans = transactions.slice(-8).reverse();
    res.status(200).json(latestTrans);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionToUser = async (req, res, next) => {
  const userName = req.params.userName;
  try {
    const transactions = await Transaction.find({ username: userName });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.countByTrans = async (req, res, next) => {
  try {
    const trans = await Transaction.countDocuments();
    res.status(200).json(trans);
  } catch (err) {
    next(err);
  }
};

exports.earnings = async (req, res, next) => {
  try {
    const trans = await Transaction.find();
    const earning = trans.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0);
    res.status(200).json(earning);
  } catch (err) {
    next(err);
  }
};

exports.balance = async (req, res, next) => {
  const months = [];
  try {
    const trans = await Transaction.find();
    const totalP = trans.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0);

    trans.map((item) => {
      const month1 = item.date.split("-")[0];
      const month = month1.split("/")[1];
      const years = item.date.split("/")[2];
      const year = years.split("-")[0];
      const monthYear = month + "/" + year;
      months.push(monthYear);
    });

    const monthsSet = new Set(months);
    const monthsUnique = Array.from(monthsSet);

    const average = (totalP / monthsUnique.length).toFixed();
    res.status(200).json(average);
  } catch (err) {
    next(err);
  }
};
