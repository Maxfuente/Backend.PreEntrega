import mongoose from "mongoose";
import { type } from "os";

const cartsCollection = "carts"

const cartsShema  = new mongoose.Schema({
    description:{type:String, required: true},
    quantity:{type:Number, required: true},
    total:{type:String, required: true}
    
    });

export const cartsModel = mongoose.model(cartsCollection, cartsShema)