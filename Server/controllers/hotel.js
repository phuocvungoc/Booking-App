const Hotel = require("../models/Hotel.js");
const Room = require("../models/Room.js");
const Transaction = require("../models/Transaction");

exports.createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

exports.deleteHotel = async (req, res, next) => {
  let checkHotel = false;
  const trans = await Transaction.find({ hotelId: req.params.id });
  if (trans.length > 0) {
    checkHotel = trans.some((tran) => tran.status !== "Checkout");
  }

  if (!checkHotel) {
    try {
      await Hotel.findByIdAndDelete(req.params.id);
      res.status(200).json("Hotel has been deleted.");
    } catch (err) {
      next(err);
    }
  } else res.status(505).json("The hotel is still booked");
};

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.getHotels = async (req, res, next) => {
  const { ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

exports.countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

exports.getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getHotelsSearch = async (req, res, next) => {
  function titleCase(str) {
    return str.toLowerCase().replace(/(^|\s)\S/g, function (l) {
      return l.toUpperCase();
    });
  }

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());
    let dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const { min, max, maxPeople, room, city, startDate, endDate } = req.query;
  const cityTitleCase = titleCase(city);
  const startDates = new Date(startDate);
  const endDates = new Date(endDate);

  const allDates = getDatesInRange(startDates, endDates);

  try {
    const roomsIsAvailable = [];
    const rooms = await Room.find({
      maxPeople: { $gte: Number(maxPeople) },
    });
    rooms.map((room) => {
      room.roomNumbers.map((item) => {
        const checkRooms = item.unavailableDates.some((date) =>
          allDates.includes(new Date(date).getTime())
        );
        if (!checkRooms) {
          roomsIsAvailable.push(room);
        }
      });
    });

    const roomsId = roomsIsAvailable.map((room) => room._id.toString());

    const hotels = await Hotel.find({
      city: cityTitleCase,
      rooms: { $in: roomsId },
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    });

    const listHotels = hotels.filter(
      (hotel) => hotel.rooms.length >= Number(room)
    );

    res.status(200).json(listHotels);
  } catch (err) {
    next(err);
  }
};
