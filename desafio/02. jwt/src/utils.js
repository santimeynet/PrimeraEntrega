import jwt from "jsonwebtoken";

const PRIVATE_KEY ="CoderKeyFeliz";

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY,{expiresIn:'1d'})
    return token;
}

export const authToken = (req,res,next) => {

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if(token === "null"){
        return res.status(401).send({status:"error",error: "No autorizado" })
    }
    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        console.log(error);
        if(error){
            return res.status(401).send({status:"error",error: "No autorizado" })
        }
        req.user = credentials.user;
        next();
    })
}