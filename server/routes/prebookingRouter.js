// server/routes/prebookingRouter.js

import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { createPrebooking, getAdminPrebookings, getUsersForPrebooking } from "../controllers/prebookingController.js";

const router = express.Router();

router.post("/:bookId", isAuthenticated, createPrebooking);
router.get("/admin/all", isAuthenticated, isAuthorized("Admin"), getAdminPrebookings);

// Route to get users for a specific pre-booked book
router.get("/users/:bookId", isAuthenticated, isAuthorized("Admin"), getUsersForPrebooking);

export default router;