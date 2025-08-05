import express from "express";
import {isAuthenticated,isAuthorized} from "../middlewares/authMiddleware.js"
import { getAllUsers, registerNewAdmin, getUserDetailsById } from "../controllers/userController.js";

const router= express.Router();

router.get("/all",isAuthenticated, isAuthorized("Admin"),getAllUsers);
router.post("/add/new-admin",isAuthenticated, isAuthorized("Admin"),registerNewAdmin);

router.get("/details/:id", isAuthenticated, isAuthorized("Admin"), getUserDetailsById);

export default router;