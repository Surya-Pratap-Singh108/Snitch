import mongoose from "mongoose";
import config from "./config.js";

const connectToDB=async ()=>{
    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to MONGO database");
    }
    catch(error){
        console.error('Error while connecting to database',error);
        throw new Error(error);
    }
}
export default connectToDB;