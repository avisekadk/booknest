// server/routes/bookRouter.js

import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
    addBook,
    deleteBook,
    getAllBook,
    updateBook,
    getPublicBooks,
    getSingleBook,
    incrementBookQuantity,
    decrementBookQuantity,
} from "../controllers/bookController.js";
import { subscribeToBook } from "../controllers/notificationController.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/public/all", getPublicBooks);

// --- CORRECTED ROUTE ORDER ---
// The /all route is now placed before the /:id route.
router.get("/all", isAuthenticated, getAllBook);
router.get("/:id", getSingleBook);

// --- AUTHENTICATED ROUTES ---
router.post("/notify-me/:bookId", isAuthenticated, subscribeToBook);

// --- ADMIN ROUTES ---
router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

// Routes for quantity management
router.put("/admin/increment/:id", isAuthenticated, isAuthorized("Admin"), incrementBookQuantity);
router.put("/admin/decrement/:id", isAuthenticated, isAuthorized("Admin"), decrementBookQuantity);

export default router;