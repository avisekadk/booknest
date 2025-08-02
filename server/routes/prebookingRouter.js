// server/routes/prebookingRouter.js
import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { createPrebooking, getAdminPrebookings } from "../controllers/prebookingController.js";

const router = express.Router();

router.post("/:bookId", isAuthenticated, createPrebooking);
router.get("/admin/all", isAuthenticated, isAuthorized("Admin"), getAdminPrebookings);

export default router;