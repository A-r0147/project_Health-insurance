import mongoose from 'mongoose';
//ה-product =סוגי טיפולים
//לכל טיפול: שם, תיאור,מחיר,תמונה- אייקון,קטגוריה וסטטוס
const productSchema = new mongoose.Schema({
    name:{
        type:String, 
        unique: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    imgUrl: String,
    category: {
        type: String,
        enum: ['General_Medicine','Dental','Pediatrics','Psychology','Orthopedics','Gynecology'],
        default: 'General_Medicine'
    },
    status:{
        type:String,
        enum:['AVAILABLE','UNAVAILABLE'],
        default:'AVAILABLE'
    }
})

export const productModel = mongoose.model('products', productSchema)