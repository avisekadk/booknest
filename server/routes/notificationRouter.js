import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { getMyNotifications, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/my-notifications", isAuthenticated, getMyNotifications);
router.delete("/:id", isAuthenticated, deleteNotification);

export default router;