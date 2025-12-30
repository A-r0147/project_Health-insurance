import mongoose from 'mongoose';
//ה-product =סוגי טיפולים
//לכל טיפול: שם, תיאור,מחיר,תמונה- ציור,קטגוריה,
//איזה תאריך ניתן לעשות?
//האם צריך סטטוס?

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
    // publicationDate: Date, //תאריך הוצאה לאור
    imgUrl: String,
    category: {
        type: String,
        enum: ['General_Medicine','Dental','Pediatrics','Psychology','Orthopedics','Gynecology'],
        default: 'General_Medicine'
    },
    // status:{
    //     type:String,
    //     enum:['AVAILABLE','OUT_OF_STOCK'],
    //     default:'AVAILABLE'
    // }
})

export const productModel = mongoose.model('products', productSchema)