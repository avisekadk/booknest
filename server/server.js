import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
})

import {app} from "./app.js"

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})

