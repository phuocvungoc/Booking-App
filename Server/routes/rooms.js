const express = require("express");
const roomControllers = require("../controllers/room.js");
const verify = require("../utils/verifyToken.js");

const router = express.Router();
//CREATE
router.post("/:hotelId", verify.verifyAdmin, roomControllers.createRoom);

//UPDATE
router.put("/availability/:id", roomControllers.updateRoomAvailability);
router.put("/:id", verify.verifyAdmin, roomControllers.updateRoom);
//DELETE
router.delete("/:id/:hotelId", verify.verifyAdmin, roomControllers.deleteRoom);
//GET

router.get("/:id", roomControllers.getRoom);
//GET ALL

router.get("/", roomControllers.getRooms);

module.exports = router;
