import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/rooms.routes.js";
import roommateRoutes from "./routes/roommates.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import visitRequestRoutes from "./routes/visit-requests.routes.js";
import uploadRoutes from "./routes/uploads.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import path from "node:path";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "roomsathi-api" });
});
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/roommates", roommateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/visit-requests", visitRequestRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/owner", ownerRoutes);
app.use(notFound);
app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`RoomSathi API listening on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Unable to start server", error);
    process.exit(1);
  });
