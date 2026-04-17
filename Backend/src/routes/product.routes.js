import {Router} from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProduct, getAllProducts, getSellerProducts } from '../controllers/product.controller.js';
import multer from 'multer';
import { validateCreateProduct } from '../validator/product.validator.js';
const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:15*1024*1024,//10mb
    }
})

const productRouter=Router();

productRouter.post('/',authenticateSeller,upload.array('images',7),validateCreateProduct,createProduct);

productRouter.get('/seller',authenticateSeller,getSellerProducts);

productRouter.get('/',getAllProducts);

export default productRouter;