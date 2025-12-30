import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['ADMIN','SECRETARY','DOCTOR','PATIENT'],
        default:'PATIENT'
    },
    // registrationDate:{
    //   type:Date,
    //   default: Date.now
    // },
    status:{
        type:Boolean,
        default:true
    }
}, {timestamps:true})

    export const userModel = mongoose.model('users',userSchema)