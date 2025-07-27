import express from "express";
import { borrowBooks, getBorrowBooksForAdmin, recordBorrowBook, returnBorrowBooks } from "../controllers/borrowControllers.js";
import {isAuthenticated, isAuthorized} from "../middlewares/authMiddleware.js"

const  router = express.Router();

router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"),recordBorrowBook );
router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"),getBorrowBooksForAdmin);
router.get("/my-borrowed-books", isAuthenticated, borrowBooks);
router.put("/return-borrowed-book/:borrowId", isAuthenticated, isAuthorized("Admin"),returnBorrowBooks);

export default router;
