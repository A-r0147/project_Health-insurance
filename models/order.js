import mongoose, { Schema } from 'mongoose';
import { productModel } from './product.js';
import { use } from 'react';

//ההזמנה = הזמנת תור לטיפול כלשהוא
//קוד לקוח- פציינט (קישור למודל לקוח)
//סוג הטיפול- בכל קביעת תור ניתן לבחור בטיפול אחד. טיפול נוסף אף לאותו לקוח ובאותו יום יעשה בתור נפרד (כי השעה שונה)
//תאריך ביצוע התור
//רופא מסוים
//כתובת-איזו? של סניף?
//התור בוצע- בוליאני
//(תאריך קביעת התור + תאריך העדכון האחרון)

const minProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    name: {
        type: String,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    imgUrl: String,
    category: {
        type: String,
        enum: ['Dental', 'General_Medicine', 'Pediatrics', 'Psychology', 'Orthopedics', 'Gynecology'],
        default: 'General_Medicine'
    }
    //צריך להוסיף בסכמת המינימום גם את הססטוס?
},
    { _id: false }
)

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    product: minProductSchema,
    appointmentDate: { //אפשרות לבחירת תאריך בו יתבצע התור
        type: Date,
        required:true
    },
    doctorName: String,
    // branchAddress:
    status: {
        type: Boolean,
        default: false //התור עוד לא בוצע
    }
}, { timestamps: true });

orderSchema.index(
    { userId:1, doctorName:1, appointmentDate:1 },
    { unique: true }
)

export const orderModel = mongoose.model('orders', orderSchema);