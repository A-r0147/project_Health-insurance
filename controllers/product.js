import { productModel } from '../models/product.js';

export async function getProducts(req, res) { //שליפת מוצרים בכמות מוגבלת -limit,page
    try {
        let products = await productModel.find() //{ status: 'AVAILABLE' }
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
        if (!product) //|| product.status !== 'AVAILABLE'
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
        if (!name || !price || !category)
            return res.status(400).json({ title: "Invalid product data", massage: "Name, price and category are required" })
        if (price < 0)
            return res.status(400).json({ title: "Invalid product data", massage: "Price must be a positive number" })
        let already = await productModel.findOne({ name, category })
        if (already)
            return res.status(400).json({ title: "Duplicate product", massage: "A product with the same name and category already exists" })
        let newProduct = new productModel({ name, description, price, imgUrl, category })
        let product = await newProduct.save()

        return res.status(201).json(product)
    }
    catch (err) {
        return res.status(500).json({ title: "Error adding product", massage: err })
    }
}

export async function updateProduct(req, res) { //חובה לבחור שדות מסוימים שיהיו חובה ולעשות בדיקות לכל שדה?
    try {
        if (!req.body)
            return res.status(400).json({ title: "Invalid product data", massage: "Product data is required" })
        let id = parseInt(req.params.id);
        let { name, description, price, imgUrl, category } = req.body;
        if (!name || !description || !price || !imgUrl || !category)
            return res.status(400).json({ title: "Invalid product data", message: "All product fields are required" });
        if (price < 0)
            return res.status(400).json({ title: "Invalid product data", message: "Price must be a positive number" });
        // צריך לבדוק את ייחודיות השם?
        let already = await productModel.findOne({ name, category })
        if (already)
            return res.status(400).json({ title: "Duplicate product", massage: "A product with the same name and category already exists" })
        let product = await productModel.findByIdAndUpdate(id, { name, description, price, imgUrl, category }, { new: true });
        if (!product) //האם נכון לבדוק רק כאן את הסטטוס?|| product.status !='AVAILABLE'
            return res.status(400).json({ title: "Product not found", message: "No product found with the given ID" });
        return res.json(product)
    }
    catch (err) {
        return res.status(500).json({ title: "Error updating product", message: err });
    }
}

//אם יש סטטוס נעשה כך, אחרת נשתמשב find...delete
export async function deleteProductById(req, res) {
    try {
        let id = parseInt(req.params.id);
        let product = await productModel.findByIdAndUpdate(id, { status: 'OUT_OF_STOCK' }, { new: true });
        if (!product)
            return res.status(404).json({ title: "Product not found", message: "No product found with the given ID" });
        return res.status(201).json(product)
    }
    catch (err) {
        return res.status(500).json({ title: "Error deleting product", message: err });
    }
}