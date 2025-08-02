import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { 
  addBook, 
  deleteBook, 
  getAllBook, 
  updateBook,
  getSingleBook // Import the new controller function
} from "../controllers/bookController.js";

import express from "express"

const router = express.Router();

// New route to get a single book by its ID
router.get("/:id", getSingleBook);

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, getAllBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);

export default router;
