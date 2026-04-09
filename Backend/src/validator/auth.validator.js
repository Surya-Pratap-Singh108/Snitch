import {body,validationResult} from 'express-validator'


function validateRequest(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            errors:errors.array()
        });
    }
    next();
}

export const validateRegisterUser = [
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),

    body('contact')
        .trim()
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("Contact must be a 10-digit number"),

    body('password')
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    body('fullname')
        .trim()
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),

    validateRequest(),
];