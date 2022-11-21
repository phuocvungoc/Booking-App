const express = require("express");
const hotelControllers = require("../controllers/hotel.js");
const verify = require("../utils/verifyToken.js");
const router = express.Router();

//CREATE
router.post("/", verify.verifyAdmin, hotelControllers.createHotel);

//UPDATE
router.put("/:id", verify.verifyAdmin, hotelControllers.updateHotel);
//DELETE
router.delete("/:id", verify.verifyAdmin, hotelControllers.deleteHotel);
//GET

router.get("/find/:id", hotelControllers.getHotel);
//GET ALL

router.get("/", hotelControllers.getHotels);
router.get("/search", hotelControllers.getHotelsSearch);
router.get("/countByCity", hotelControllers.countByCity);
router.get("/countByType", hotelControllers.countByType);
router.get("/room/:id", hotelControllers.getHotelRooms);

module.exports = router;
