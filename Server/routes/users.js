const express = require("express");
const userControllers = require("../controllers/user.js");
const verify = require("../utils/verifyToken.js");

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req,res,next)=>{
//   res.send("hello user, you are logged in")
// })

// router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
//   res.send("hello user, you are logged in and you can delete your account")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
//   res.send("hello admin, you are logged in and you can delete all accounts")
// })

//UPDATE
router.put("/:id", verify.verifyUser, userControllers.updateUser);

//DELETE
router.delete("/:id", verify.verifyUser, userControllers.deleteUser);

router.get("/count", userControllers.countByUser);
//GET
router.get("/:id", verify.verifyUser, userControllers.getUser);

//GET ALL
router.get("/", userControllers.getUsers);

module.exports = router;
