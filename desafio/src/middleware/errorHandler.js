import { EError } from "../enums/EError.js";

export const errorHandler = (error, req, res,next) =>{
    switch (error.code) {
        case EError.AUTH_ERROR:
            res.json({status:"error", error:error.cause, message:error.message})
            break;
        case EError.DATABASE_ERROR:
            res.json({status:"error", message:error.message})
            break;
        case EError.INVALID_PARAM:
            res.json({status:"error", error:error.cause})
        default:
            res.json({status:"error", message:"Hubo un error, conacte al equipo de sistemas."})
            break;
    }
}