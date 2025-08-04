import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { createPrebooking, getAdminPrebookings, getUsersForPrebooking, getMyPrebookings } from "../controllers/prebookingController.js";

const router = express.Router();

router.post("/:bookId", isAuthenticated, createPrebooking);
router.get("/my-prebookings", isAuthenticated, getMyPrebookings);
router.get("/admin/all", isAuthenticated, isAuthorized("Admin"), getAdminPrebookings);
router.get("/users/:bookId", isAuthenticated, isAuthorized("Admin"), getUsersForPrebooking);

export default router;