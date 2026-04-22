import mongoose from "mongoose";

const priceSchema=new mongoose.Schema({
    amount:{
    type: Number,
    required: true,
    },
    currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
    default:'INR',
    },
},
{
    _id:false,//no id
    _v:false,//no version
})

export default priceSchema;