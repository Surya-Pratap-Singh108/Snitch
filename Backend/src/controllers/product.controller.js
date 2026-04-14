import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req,res) {
    const {title,description,priceAmount,priceCurrenncy}=req.body;
    const seller=req.user;
    console.log(req.files);
    const images=await Promise.all(req.files.map(async(file)=>{
        return await uploadFile({
            buffer:file.buffer,
            fileName:file.originalname,
        })
    }));

    const product=await productModel.create({
        title,
        description,
        price:{
            amount:priceAmount,
            currency:priceCurrenncy||'INR',
        },
        images,
        seller:seller._id,
    })
    res.status(201).json({
            message:'Product created Successfully!',
            success:true,
            product,
        });
    
}