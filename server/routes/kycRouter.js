// server/routes/kycRouter.js
import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  submitKyc,
  getMyKycStatus,
  getAllKycSubmissions,
  updateKycStatus,
} from "../controllers/kycController.js";


const router = express.Router();


// User Routes
router.post("/submit", isAuthenticated, submitKyc);
router.get("/status", isAuthenticated, getMyKycStatus);

// Admin Routes
router.get("/admin/all", isAuthenticated, isAuthorized("Admin"), getAllKycSubmissions);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateKycStatus);


export default router;