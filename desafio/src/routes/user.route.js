import { Router } from "express";
import { CustomError } from "../service/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateUserErrorInfo } from "../service/userErrorInfo.js";
import { generateUserErrorParam } from "../service/userErrorParam.js";


const router = Router();

const users = [];

router.get("/", (req,res)=>{
    res.json({status:"success", data:users})
})

router.post("/", (req,res)=>{
    const {first_name, last_name, email} = req.body;

    if(!first_name || !last_name || !email){
        CustomError.createError({
            name:"User create error",
            cause: generateUserErrorInfo(req.body),
            message:"Error creando el usuario",
            errorCode:EError.INVALID_PARAM
        });
    }

    const newUser = {
        id: users.length+1,
        first_name,
        last_name,
        email
    }
    users.push(newUser);

    res.json({status:"success", data:users})

})

router.get("/:uid", (req,res)=>{
    const { uid } = req.params;
    const userID = parseInt(uid);
    
    if(Number.isNaN(userID)){
        CustomError.createError({
            name:"user get by ID Error",
            cause:generateUserErrorParam(uid),
            message:"error al buscar un usuario por el id",
            errorCode:EError.INVALID_PARAM
        })
    }

    const user = users.find(u=>u.id === userID);

    res.json({status:"success", data:user})
    

})

export {router as usersRouter}