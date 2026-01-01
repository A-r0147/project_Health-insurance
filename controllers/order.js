import { orderModel } from '../models/order.js';

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
        let { userId, products, appointmentDate } = req.body
        if (!userId || !products || !appointmentDate)
            return res.status(400).json({ title: "Invalid order data", message: "User ID, products, and appointment date are required" })
        let already = await orderModel.findOne({ userId, products, appointmentDate })
        if (already)
            return res.status(400).json({ title: "Duplicate order", message: "An order with the same user ID, products, and appointment date already exists" })
        let newOrder = new orderModel({ userId, products, appointmentDate })
        let order = await newOrder.save()
        return res.status(201).json(order)
    }
    catch (err) {
        return res.status(500).json({ title: "Error adding order", message: err })
    }
}

export async function cancelOrder(req, res) {
    try {
        let {orderId} = req.body //או מהפרמטרים של ה URL?
        let order = await orderModel.findByIdAndDelete(orderId, { status: false }) //האם צריך למחוק או לשנות סטטוס?
        if (!order)
            return res.status(404).json({ title: "Order not found", message: "No order found with the given ID" })
        return res.status(200).json(order)
    }
    catch (err) {
        return res.status(500).json({ title: "Error cancelling order", message: err })
    }
}

export async function getOrdersByUserId(req, res) {
    try{
        let {userId} = req.params; //איך ניתן לשלוף את ה id של המשתמש ע"י גישה ישירה ולא דרך שליחת ה id?

    }
    catch(err){
        return res.status(500).json({ title: "Error retrieving orders by user ID", message: err });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        let id = req.params.id;
        let order = await orderModel.findById(id,{ status:false})
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
