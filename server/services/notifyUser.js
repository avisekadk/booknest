// server/services/notifyUser.js

import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Notification } from "../models/notificationModel.js";
import { calculateFine } from "../utils/fineCalculator.js"; // Import the fine calculator

/**
 * @description Schedules a cron job to check for overdue books and notify users via email and in-app notifications.
 * This function runs every 30 minutes.
 */
export const notifyUsers = () => {
    // This cron job runs every 30 minutes. You can adjust the schedule as needed.
    cron.schedule("*/30 * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: { $lt: oneDayAgo },
                returnDate: null,
                notified: false,
            }).populate("user", "name email")
              .populate("book", "title");

            console.log(`Found ${borrowers.length} overdue books to notify.`);

            for (const element of borrowers) {
                if (element.user && element.user.email && element.book) {
                    const bookTitle = element.book.title;
                    const userName = element.user.name;
                    const userEmail = element.user.email;
                    const userId = element.user._id;
                    const bookId = element.book._id;

                    // FIX: Calculate the fine and include it in the messages
                    const fine = calculateFine(element.dueDate);

                    await sendEmail({
                        email: userEmail,
                        subject: "Book Return Reminder: Your Book is Overdue!",
                        message: `Hello ${userName},\n\nThis is a reminder that the book "${bookTitle}" you borrowed is now overdue. Your current fine is Nrs. ${fine}. Please return it as soon as possible to avoid any potential fines.\n\nThank you,\nBookNest Team`
                    });

                    await Notification.create({
                        userId: userId,
                        message: `The book "${bookTitle}" is overdue. Current fine: Nrs. ${fine}.`,
                        bookId: bookId,
                        type: 'overdue',
                    });

                    element.notified = true;
                    await element.save();

                    console.log(`Notified user ${userName} (${userEmail}) about overdue book "${bookTitle}".`);
                } else {
                    console.warn(`Skipping notification for borrow ID ${element._id}: Missing user or book details.`);
                }
            }
        } catch (error) {
            console.error("Error occurred while notifying users about overdue books:", error);
        }
    });
};