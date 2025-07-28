const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendotp,
  asehi,
  verifyotp,
  addcontact,
  deletecontact,
  getcontacts,
} = require("../controllers/user.js");
const { requireAuth } = require("../config/auth.js");

router.route("/").post(signup);
router.route("/login").post(login);
router.route("/sendotp").post(sendotp);
router.route("/verifyotp").post(verifyotp);
router.route("/addcontact").post(requireAuth, addcontact); 
router.route("/deletecontact/:contactId").delete(requireAuth, deletecontact); 
router.route("/getcontacts").get(requireAuth, getcontacts);
router.route("/asehi").post(requireAuth, asehi); 

module.exports = router;
