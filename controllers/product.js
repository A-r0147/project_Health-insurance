import { productModel } from '../models/product.js';

export async function getTotalPages(req, res) {
    try {
        let limit = Number(req.query.limit);
        if (!limit || limit <= 0)
            limit = 3;
        let count = await productModel.countDocuments({ status: 'AVAILABLE' });
        let totalPages = Math.ceil(count / limit);
        return res.json({ totalPages });
    }
    catch (err) {
        return res.status(500).json({ title: "Error calculating total pages", message: err });
    }
}

export async function getProducts(req, res) {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 3;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let products = await productModel.find({ status: 'AVAILABLE' }).skip((page - 1) * limit).limit(limit);
        return res.json(products)
    }
    catch (err) {
        return res.status(500).json({ title: "Error retrieving products", massage: err })
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params
        let product = await productModel.findById(id)
        if (!product || product.status !== 'AVAILABLE')
            return res.status(404).json({ title: "No such product", massage: "Product not found" })
        return res.json(product)
    }
    catch (err) {
        return res.status(500).json({ title: "Error retrieving product", massage: err })
    }
}

export async function addProduct(req, res) {
    try {
        if (!req.body)
            return res.status(400).json({ title: "Invalid product data", massage: "Product data is required" })
        let { name, description, price, imgUrl, category } = req.body
        if (!name || !price || !category || !imgUrl)
            return res.status(400).json({ title: "Invalid product data", massage: "Name, price, category or image URL are required" })
        if (name.length < 2)
            return res.status(400).json({ title: "Invalid product data", massage: "Name must be at least 2 characters long" })
        if (price < 0)
            return res.status(400).json({ title: "Invalid product data", massage: "Price must be a positive number" })
        let already = await productModel.findOne({ name })
        if (already)
            //אם יש כבר טיפול כזה אך הסטטוס שלו UNAVAILABLE- לשנות את הסטטוס ל AVAILABLE?
            return res.status(400).json({ title: "Duplicate product", massage: "A product with the same name already exists" })
        let newProduct = new productModel({ name, description, price, imgUrl, category })
        let product = await newProduct.save()

        return res.status(201).json(product)
    }
    catch (err) {
        return res.status(500).json({ title: "Error adding product", massage: err })
    }
}

export async function updateProduct(req, res) {
    try {
        if (!req.body)
            return res.status(400).json({ title: "Invalid product data", massage: "Product data is required" })
        let { name, description, price, imgUrl, category } = req.body;
        if (!name || !description || !price || !imgUrl || !category)
            return res.status(400).json({ title: "Invalid product data", message: "All product fields are required" });
        if (price < 0)
            return res.status(400).json({ title: "Invalid product data", message: "Price must be a positive number" });
        // צריך לבדוק את ייחודיות השם?
        //צריך לבדוק את הסטטוס?
        let id = req.params.id;
        let product = await productModel.findByIdAndUpdate(id, { name, description, price, imgUrl, category }, { new: true });
        if (!product)
            return res.status(400).json({ title: "Product not found", message: "No product found with the given ID" });
        return res.json(product)
    }
    catch (err) {
        return res.status(500).json({ title: "Error updating product", message: err });
    }
}

export async function deleteProductById(req, res) {
    try {
        let id = req.params.id;
        let product = await productModel.findByIdAndUpdate(id, { status: 'UNAVAILABLE' }, { new: true });
        if (!product)
            return res.status(404).json({ title: "Product not found", message: "No product found with the given ID" });
        return res.status(201).json({title:"Product deleted", product})
    }
    catch (err) {
        return res.status(500).json({ title: "Error deleting product", message: err });
    }
}