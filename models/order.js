import mongoose, { Schema } from 'mongoose';
import { productModel } from './product.js';
import { use } from 'react';

//ההזמנה = הזמנת תור לטיפול כלשהוא
//תאריך קביעת התור - צריך?
//תאריך ביצוע התור
//רופא מסוים?
//כתובת-איזו? של סניף?
//קוד לקוח- פציינט
//סוג הטיפול/ים- לקוח אחד יכול לקבוע תור לכמה טיפולים בו זמנית
//התור בוצע- בוליאני

const minProductSchema = new mongoose.Schema({ //יש צורך לפרט לכל אחד מהשדות כמו בסכמת המקור?
    name:{
        type:String, 
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    imgUrl: String,
    category: {
        type: String,
        enum: ['Dental','General_Medicine','Pediatrics','Psychology','Orthopedics','Gynecology'],
        default: 'General_Medicine'
    },
    //צריך להוסיף בסכמת המינימום את הסטטוס?- אם קיים
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
})

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products:{
        type:minProductSchema,
        enum:[]
    } ,
    appointmentDate:{ //אפשרות לבחירת תאריך ביצוע התור
        type: Date,
        default: Date.now                                                                                                                                                                                    
    },
    // doctorName:
    // branchAddress:
    status:{
        type:Boolean,
        default:false //התור עוד לא בוצע
    }
}, { timestamps: true })

export const orderModel = mongoose.model('orders', orderSchema);