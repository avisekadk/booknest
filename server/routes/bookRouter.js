import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { 
  addBook, 
  deleteBook, 
  getAllBook, 
  updateBook,
  getSingleBook
} from "../controllers/bookController.js";

import express from "express"

const router = express.Router();

// This route no longer requires authentication so that anyone can view the books.
// It is placed first to avoid matching with the more general /:id route.
router.get("/all", getAllBook);

// New route to get a single book by its ID. It is public so anyone can view it.
router.get("/:id", getSingleBook);

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);

export default router;
