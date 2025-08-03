import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { 
    addBook, 
    deleteBook, 
    getAllBook, 
    updateBook,
    getPublicBooks, // Controller for public book list
    getSingleBook, // Controller for a single public book
    incrementBookQuantity, // Controller for incrementing quantity
    decrementBookQuantity, // Controller for decrementing quantity
} from "../controllers/bookController.js";
import { subscribeToBook } from "../controllers/notificationController.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
// These routes do not require authentication and can be accessed by anyone.

// Route to get all books. This is now a public route.
router.get("/all", getAllBook);

// Route to get a specific list of public books.
router.get("/public/all", getPublicBooks);

// Route to get a single book by its ID. This is also public.
// This route must come after "/all" to prevent it from matching with the "all" path.
router.get("/:id", getSingleBook);

// --- AUTHENTICATED & AUTHORIZED ADMIN ROUTES ---
// These routes require the user to be logged in and have the 'Admin' role.

// Route to add a new book (Admin only)
router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);

// Route to delete a book by ID (Admin only)
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

// Route to update a book by ID (Admin only)
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);

// --- QUANTITY MANAGEMENT ROUTES (Admin only) ---
// These are new routes specifically for updating book quantities.

// Route to increment a book's quantity by ID (Admin only)
router.put("/admin/increment/:id", isAuthenticated, isAuthorized("Admin"), incrementBookQuantity);

// Route to decrement a book's quantity by ID (Admin only)
router.put("/admin/decrement/:id", isAuthenticated, isAuthorized("Admin"), decrementBookQuantity);

// Route for users to subscribe to a book's availability notification
router.post("/notify-me/:bookId", isAuthenticated, subscribeToBook);

export default router;