import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Notification } from "../models/notificationModel.js"; // Import Notification model

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // MODIFICATION: Populate book details to get the title
      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo },
        returnDate: null,
        notified: false,
      }).populate("book", "title"); // Populate the book title

      for (const element of borrowers) {
        if (element.user && element.user.email && element.book) {
          const bookTitle = element.book.title;

          sendEmail({
            email: element.user.email,
            subject: "Book Return Reminder",
            message: `Hello ${element.user.name}.\nThis is a reminder that the book "${bookTitle}" you borrowed is overdue. Please return it soon.`,
          });
          
          // ADD THIS: Create a notification in the database
          await Notification.create({
            userId: element.user._id, // Use element.user._id to ensure it's the correct ID
            message: `The book "${bookTitle}" is overdue. Please return it to avoid fines.`,
            bookId: element.book._id,
            type: 'overdue' // Use the 'overdue' type
          });

          element.notified = true;
          await element.save();
        }
      }
    } catch (error) {
      console.error("Some error occurred while notifying users.", error);
    }
  });
};