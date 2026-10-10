const express = require("express");
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require("../controllers/roomController");
const { getReviewsForRoom, addReview, deleteReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", protect, authorize("owner", "admin"), createRoom);
router.put("/:id", protect, authorize("owner", "admin"), updateRoom);
router.delete("/:id", protect, authorize("owner", "admin"), deleteRoom);

// Reviews nested under a room
router.get("/:roomId/reviews", getReviewsForRoom);
router.post("/:roomId/reviews", protect, addReview);
router.delete("/:roomId/reviews/:reviewId", protect, deleteReview);

module.exports = router;
