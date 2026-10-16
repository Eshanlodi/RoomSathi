import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { User } from "./models/user.model.js";
import { RoommateProfile } from "./models/roommate-profile.model.js";
import { Room } from "./models/room.model.js";
import { Review } from "./models/review.model.js";
import { Wishlist } from "./models/wishlist.model.js";
import { Notification } from "./models/notification.model.js";
import { VisitRequest } from "./models/visit-request.model.js";
import { RoomView } from "./models/room-view.model.js";

await connectDatabase();

const password = await bcrypt.hash("password123", 12);
const legacyEmails = [
  "owner@roomsathi.local",
  "admin@roomsathi.local",
  "aarav@roomsathi.local",
  "meera@roomsathi.local",
  "kabir@roomsathi.local",
];
const legacyUsers = await User.find({ email: { $in: legacyEmails } }, "_id");
const legacyUserIds = legacyUsers.map((user) => user._id);
const legacyRooms = await Room.find({ ownerId: { $in: legacyUserIds } }, "_id");
const legacyRoomIds = legacyRooms.map((room) => room._id);
await Promise.all([
  Review.deleteMany({
    $or: [{ userId: { $in: legacyUserIds } }, { roomId: { $in: legacyRoomIds } }],
  }),
  RoommateProfile.deleteMany({ userId: { $in: legacyUserIds } }),
  Room.deleteMany({ _id: { $in: legacyRoomIds } }),
  User.deleteMany({ _id: { $in: legacyUserIds } }),
]);

const users = [
  {
    name: "RoomSathi Owner",
    email: "owner.roomsathi@gmail.com",
    role: "owner",
    phone: "9999999999",
    college: "IPS Academy",
    address: "Vijay Nagar, Indore",
  },
  {
    name: "RoomSathi Admin",
    email: "admin.roomsathi@gmail.com",
    role: "admin",
    phone: "9999999998",
  },
  {
    name: "Aarav Sharma",
    email: "aarav.roomsathi@gmail.com",
    role: "student",
    phone: "9999999991",
    college: "IPS Academy",
  },
  {
    name: "Meera Patel",
    email: "meera.roomsathi@gmail.com",
    role: "student",
    phone: "9999999992",
    college: "DAVV",
  },
  {
    name: "Kabir Khan",
    email: "kabir.roomsathi@gmail.com",
    role: "student",
    phone: "9999999993",
    college: "Medicaps University",
  },
];

const savedUsers = {};
for (const userData of users) {
  savedUsers[
    userData.role === "student" ? userData.email.split("@")[0].split(".")[0] : userData.role
  ] = await User.findOneAndUpdate(
    { email: userData.email },
    { ...userData, password },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );
}

const demoOwnerIds = [savedUsers.owner._id];
const oldDemoRooms = await Room.find({ ownerId: { $in: demoOwnerIds } }, "_id");
await Promise.all([
  Review.deleteMany({ roomId: { $in: oldDemoRooms.map((room) => room._id) } }),
  Room.deleteMany({ ownerId: { $in: demoOwnerIds } }),
]);

const rooms = await Room.insertMany([
  {
    ownerId: savedUsers.owner._id,
    name: "Campus View Private Room",
    type: "Flat",
    rent: 8500,
    deposit: 17000,
    city: "Indore",
    college: "IPS Academy",
    distance: "0.8 km",
    sharing: "Single",
    verified: true,
    facilities: ["Wi-Fi", "Power backup", "Attached bathroom"],
    images: [],
    description: "A furnished private room close to IPS Academy with dependable utilities.",
  },
  {
    ownerId: savedUsers.owner._id,
    name: "Vijay Nagar Student Flat",
    type: "Flat",
    rent: 6000,
    deposit: 12000,
    city: "Indore",
    college: "DAVV",
    distance: "2.1 km",
    sharing: "Double",
    verified: true,
    facilities: ["Wi-Fi", "Kitchen", "Laundry", "Parking"],
    images: [],
    description: "Budget-friendly shared flat with a common kitchen and laundry area.",
  },
  {
    ownerId: savedUsers.owner._id,
    name: "Medicaps Road Triple Sharing",
    type: "PG",
    rent: 4500,
    deposit: 9000,
    city: "Indore",
    college: "Medicaps University",
    distance: "1.4 km",
    sharing: "Triple",
    verified: false,
    facilities: ["Meals", "Wi-Fi", "Housekeeping"],
    images: [],
    description: "Affordable triple-sharing PG option for students near Medicaps University.",
  },
]);

const profiles = [
  {
    userId: savedUsers.aarav._id,
    college: "IPS Academy",
    city: "Indore",
    budget: 8000,
    lifestyle: {
      sleepSchedule: "early_bird",
      cleanliness: 5,
      smoking: false,
      drinking: false,
      guestsFrequency: "rarely",
      studyHabits: "silent",
      foodPreference: "veg",
    },
  },
  {
    userId: savedUsers.meera._id,
    college: "DAVV",
    city: "Indore",
    budget: 6500,
    lifestyle: {
      sleepSchedule: "flexible",
      cleanliness: 4,
      smoking: false,
      drinking: false,
      guestsFrequency: "sometimes",
      studyHabits: "moderate",
      foodPreference: "veg",
    },
  },
  {
    userId: savedUsers.kabir._id,
    college: "Medicaps University",
    city: "Indore",
    budget: 5000,
    lifestyle: {
      sleepSchedule: "night_owl",
      cleanliness: 3,
      smoking: false,
      drinking: true,
      guestsFrequency: "sometimes",
      studyHabits: "flexible",
      foodPreference: "either",
    },
  },
];

await RoommateProfile.bulkWrite(
  profiles.map((profile) => ({
    updateOne: {
      filter: { userId: profile.userId },
      update: { $set: profile },
      upsert: true,
    },
  })),
);

await Review.insertMany([
  {
    roomId: rooms[0]._id,
    userId: savedUsers.aarav._id,
    rating: 5,
    text: "Very close to campus and the room was exactly as listed.",
  },
  {
    roomId: rooms[1]._id,
    userId: savedUsers.meera._id,
    rating: 4,
    text: "Good facilities for the price. The kitchen is well maintained.",
  },
  {
    roomId: rooms[2]._id,
    userId: savedUsers.kabir._id,
    rating: 4,
    text: "Affordable option with helpful housekeeping staff.",
  },
]);

await Promise.all([
  Wishlist.deleteMany({
    userId: { $in: [savedUsers.aarav._id, savedUsers.meera._id, savedUsers.kabir._id] },
  }),
  Notification.deleteMany({
    userId: {
      $in: [savedUsers.aarav._id, savedUsers.meera._id, savedUsers.kabir._id, savedUsers.owner._id],
    },
  }),
  VisitRequest.deleteMany({
    $or: [
      { studentId: { $in: [savedUsers.aarav._id, savedUsers.meera._id, savedUsers.kabir._id] } },
      { ownerId: savedUsers.owner._id },
    ],
  }),
  RoomView.deleteMany({ roomId: { $in: rooms.map((room) => room._id) } }),
]);

await Wishlist.create({ userId: savedUsers.aarav._id, roomId: rooms[0]._id });
await Notification.create({
  userId: savedUsers.aarav._id,
  type: "room_match",
  title: "Room saved successfully",
  message: "Campus View Private Room is in your wishlist.",
  actionUrl: `/rooms/${rooms[0]._id}`,
});
await VisitRequest.create({
  roomId: rooms[1]._id,
  studentId: savedUsers.meera._id,
  ownerId: savedUsers.owner._id,
  status: "pending",
  message: "I would like to visit this room this weekend.",
});
await RoomView.insertMany([
  { roomId: rooms[0]._id, userId: savedUsers.aarav._id },
  { roomId: rooms[0]._id, userId: savedUsers.meera._id },
  { roomId: rooms[1]._id, userId: savedUsers.kabir._id },
]);

console.log("Seed complete: 5 users, 3 roommate profiles, 3 rooms, and 3 reviews.");
console.log("Feature seed: 1 wishlist, 1 notification, 1 pending visit request, and 3 room views.");
console.log("Demo password for every seeded account: password123");
console.log("Owner: owner.roomsathi@gmail.com");
console.log("Admin: admin.roomsathi@gmail.com");
console.log(
  "Students: aarav.roomsathi@gmail.com, meera.roomsathi@gmail.com, kabir.roomsathi@gmail.com",
);
process.exit(0);
