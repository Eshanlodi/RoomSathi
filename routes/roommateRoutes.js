const express = require("express");
const { upsertRoommateProfile, getRoommates, getRoommateById } = require("../controllers/roommateController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All roommate routes require login, since matching is personalized
// against the logged-in user's own profile.
router.post("/", protect, upsertRoommateProfile);
router.get("/", protect, getRoommates);
router.get("/:id", protect, getRoommateById);

module.exports = router;
