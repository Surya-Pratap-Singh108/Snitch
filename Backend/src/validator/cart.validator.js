import {body,validationResult,param} from 'express-validator'


function validateRequest(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    next();
}

export const validateToCart=[
    param('productId').isMongoId().withMessage("Invalid Product ID"),
    param('variantId').isMongoId().withMessage("Invalid Variant ID"),
    body('quantity').optional().isInt({min:1}).withMessage("Quantity must be atleast 1"),
    validateRequest
]
export const validateIncrementCartItemQuantity=[
    param('productId').isMongoId().withMessage("Invalid Product ID"),
    param('variantId').isMongoId().withMessage("Invalid Variant ID"),
    validateRequest
]