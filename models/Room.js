const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["PG", "Flat", "Hostel", "Shared Room"],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    nearestCollege: { type: String, trim: true },
    distanceFromCollegeKm: { type: Number, default: null },
    location: {
      // GeoJSON point for maps integration / geo queries
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    price: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    amenities: [{ type: String }], // e.g. WiFi, Food, Parking, AC, CCTV
    images: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    availableFrom: { type: Date },
    description: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

roomSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Room", roomSchema);
