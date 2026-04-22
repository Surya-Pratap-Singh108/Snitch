import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req,res) {
    
    const {title,description,priceAmount,priceCurrenncy}=req.body;
    const seller=req.user;
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

export async function getSellerProducts(req,res) {
    const seller=req.user;
    const products=await productModel.find({
        seller:seller._id,
    })
    res.status(200).json({
            message:'Fetch all Products of this seller Successfully!',
            success:true,
            products,
        });

}

export async function getAllProducts(req,res){
    const products=await productModel.find();
    return res.status(200).json({
            message:'Products fetch Successfully!',
            success:true,
            products,
        });
}
export async function getProduct(req,res){
    const {productId}=req.params
    const product=await productModel.findById(productId);
    if(!product){
        return res.status(404).json({
            message:'Product not found!',
            success:false,
        }); 
    }
    return res.status(200).json({
            message:'Product fetch Successfully!',
            success:true,
            product,
        });
}

export async function addProductVarient(req,res){

    const {productId}=req.params;
    console.log(productId);

    const product=await productModel.findOne({
        _id:productId,
        seller:req.user._id,
    })
    if(!product){
        return res.status(404).json({
            message:'Product not found!',
            success:false,
        });
    }

    const files = req.files || [];

  const images = files.length
    ? await Promise.all(
        files.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        })
      )
    : [];
    const price=req.body.priceAmount;
    const stock=req.body.stock;
    const attributes=JSON.parse(req.body.attributes||'{}');

    product.variants.push({
        images,
        price:{
            amount:price||product.price.amount,
            currency:req.body.priceCurrency||product.price.currency
        },
        stock,
        attributes
    })
    await product.save();
    return res.status(201).json({
        message:"variant added successfully",
        success:true,
        product
    })
}