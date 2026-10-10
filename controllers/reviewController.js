const Review = require("../models/Review");
const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");

// Recalculates a room's average rating and review count after a review changes
const refreshRoomRating = async (roomId) => {
  const stats = await Review.aggregate([
    { $match: { room: roomId } },
    { $group: { _id: "$room", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Room.findByIdAndUpdate(roomId, {
    rating: stats.length ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    reviewCount: stats.length ? stats[0].count : 0,
  });
};

// @route   GET /api/rooms/:roomId/reviews
// @access  Public
const getReviewsForRoom = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ room: req.params.roomId }).populate("user", "name avatar");
  res.json({ count: reviews.length, reviews });
});

// @route   POST /api/rooms/:roomId/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "Rating is required" });
  }

  const room = await Room.findById(req.params.roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const existing = await Review.findOne({ room: req.params.roomId, user: req.user._id });
  if (existing) {
    return res.status(400).json({ message: "You have already reviewed this room" });
  }

  const review = await Review.create({
    room: req.params.roomId,
    user: req.user._id,
    rating,
    comment,
  });

  await refreshRoomRating(req.params.roomId);

  res.status(201).json(review);
});

// @route   DELETE /api/rooms/:roomId/reviews/:reviewId
// @access  Private (review author or admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const isAuthor = review.user.toString() === req.user._id.toString();
  if (!isAuthor && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this review" });
  }

  await review.deleteOne();
  await refreshRoomRating(req.params.roomId);

  res.json({ message: "Review removed" });
});

module.exports = { getReviewsForRoom, addReview, deleteReview };
