import mongoose from 'mongoose';
import 'dotenv/config';


export default async function connectMongoDB() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

    } catch (error) {
        console.error(error);
    }
}