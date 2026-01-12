import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import { connectToDB } from './config/db.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors()); //איפשור גישה מקליינט לשרת

connectToDB();

app.use("/api/products", productRouter);
app.use("/api/users",userRouter);
app.use("/api/orders",orderRouter);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})