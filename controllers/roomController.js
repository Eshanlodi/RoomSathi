const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");

// @route   GET /api/rooms
// @desc    List rooms with optional filters: city, type, minPrice, maxPrice, college
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const { city, type, minPrice, maxPrice, college, sort } = req.query;

  const filter = {};
  if (city) filter.city = new RegExp(city, "i");
  if (type) filter.type = type;
  if (college) filter.nearestCollege = new RegExp(college, "i");
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let query = Room.find(filter).populate("owner", "name email phone");

  if (sort === "price_asc") query = query.sort({ price: 1 });
  else if (sort === "price_desc") query = query.sort({ price: -1 });
  else if (sort === "distance") query = query.sort({ distanceFromCollegeKm: 1 });
  else query = query.sort({ createdAt: -1 });

  const rooms = await query;
  res.json({ count: rooms.length, rooms });
});

// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("owner", "name email phone");

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.json(room);
});

// @route   POST /api/rooms
// @desc    Create a new room listing (owner only)
// @access  Private (owner)
const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create({
    ...req.body,
    owner: req.user._id, // owner is always the logged-in user, never trust client input here
  });

  res.status(201).json(room);
});

// @route   PUT /api/rooms/:id
// @desc    Update a room listing (only the owner who created it, or admin)
// @access  Private (owner)
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const isOwner = room.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to edit this listing" });
  }

  Object.assign(room, req.body);
  const updatedRoom = await room.save();

  res.json(updatedRoom);
});

// @route   DELETE /api/rooms/:id
// @access  Private (owner)
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const isOwner = room.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized to delete this listing" });
  }

  await room.deleteOne();
  res.json({ message: "Room listing removed" });
});

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
