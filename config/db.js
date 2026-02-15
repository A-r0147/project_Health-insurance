import mongoose from "mongoose";

export function connectToDB() {
    try {
        mongoose.connect(process.env.DB)
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Error connecting to DB:", err);
        process.exit(1);
    };
}
