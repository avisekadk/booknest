import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
    cron.schedule("*/30 * * * *", async () => {
       try{
            const oneDayAgo = new Date(Date.now()-24*60*60*1000);
            const borrowers = await Borrow.find({
                dueDate:{
                    $lt:oneDayAgo
                },
                returnDate:null,
                notified:false,
            });

            for (const element of borrowers) {
                if (element.user && element.user.email) {
                    sendEmail({
                        email:element.user.email,
                        subject:"Book Return Remainder",
                        message:`Hello ${element.user.name}.\n This is a remainder that you book borrow.`
                    });
                    element.notified=true;
                    await element.save();
                }
            }
       } catch(error){
            console.error("Some error occur while notifying users.",error);
       }
    });
};