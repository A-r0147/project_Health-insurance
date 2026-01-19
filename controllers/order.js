import { orderModel } from '../models/order.js';
import { userModel } from '../models/user.js';
import { productModel } from '../models/product.js';
import { parse } from 'dotenv';

export async function getOrders(req, res) {
    try {
        let orders = await orderModel.find();
        return res.json(orders);
    }
    catch (err) {
        return res.status(500).json({ title: "Error retrieving orders", message: err })
    }
}

export async function addOrder(req, res) {
    try {
        if (!req.body)
            return res.status(400).json({ title: "Invalid order data", message: "Order data is required" })
        let { userId, productId, appointmentDate, doctorName } = req.body
        if (!userId || !productId || !appointmentDate)
            return res.status(400).json({ title: "Invalid order data", message: "User ID, productId, and appointment date are required" })
        let user = await userModel.findById(userId);
        if (!user || user.status === false)
            return res.status(404).json({ title: "No such user", message: "User not found" })
        let product = await productModel.findById(productId);
        if (!product || product.status !== 'AVAILABLE')
            return res.status(404).json({ title: "No such product", message: "Product not found" })
        let parsedDate;
        if (typeof appointmentDate === "string" && appointmentDate.includes("/")) {  //המרת מחרוזת התאריך שהתקבלה לפורמט תאריך
            let [date, time = "00:00"] = appointmentDate.split(" ");
            let [day, month, year] = date.split("/");
            let [hour, minute] = time.split(":").map(Number);
            parsedDate = new Date(Number(year), Number(month) - 1, Number(day), hour, minute);
        }
        else
            parsedDate = new Date(appointmentDate);
        if (isNaN(parsedDate.getTime()))  //בדיקה זו מחזירה True אם הערך אינו תאריך חוקי
            return res.status(400).json({ title: "Invalid date format", message: "Invalid date format. Expected DD/MM/YYYY" });
        parsedDate.setSeconds(0, 0);
        let now = new Date();
        now.setSeconds(0, 0);
        if (parsedDate < now) //בדיקה אם התאריך שנבחר כבר עבר
            return res.status(400).json({ title: "Invalid appointment date", message: "Appointment date must be in the future" });
        appointmentDate = parsedDate;
        let already = await orderModel.findOne({ userId, doctorName, appointmentDate })
        if (already)
            return res.status(400).json({ title: "Duplicate order", message: "An order with the same user ID, products, and appointment date already exists" })
        let minProduct = { productId: product._id, name: product.name, price: product.price, imgUrl: product.imgUrl, category: product.category };
        let newOrder = new orderModel({ userId, product: minProduct, appointmentDate, doctorName })
        let order = await newOrder.save();
        return res.status(201).json(order)
    }
    catch (err) {
        return res.status(500).json({ title: "Error adding order", message: err })
    }
}

export async function cancelOrder(req, res) {
    try {
        let { id } = req.params
        let order = await orderModel.findByIdAndDelete(id)
        if (!order)
            return res.status(404).json({ title: "Order not found", message: "No order found with the given ID" })
        return res.status(200).json(order)
    }
    catch (err) {
        return res.status(500).json({ title: "Error cancelling order", message: err })
    }
}

export async function getOrdersByUserId(req, res) {
    try {
        let { userId } = req.params; //איך ניתן לשלוף את ה id של המשתמש ע"י גישה ישירה ולא דרך שליחת ה id?
        let orders = await orderModel.find({ userId: userId });
        return res.json(orders);
    }
    catch (err) {
        return res.status(500).json({ title: "Error retrieving orders by user ID", message: err });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        let id = req.params.id;
        let order = await orderModel.findById(id, { status: false })
        if (!order)
            return res.status(404).json({ title: "Order not found", message: "No order found with the given ID" });
        order.status = true;
        await order.save();
        return res.status(200).json(order);
    }
    catch (err) {
        return res.status(500).json({ title: "Error updating order status", message: err });
    }
}
