import { Router } from "express";
import UserModel from "../dao/db/models/Users.model.js"
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
async (req,res) => {
    res.send({status:"success", message:"User registrado"})
})

router.get("/failregister", async (req,res)=>{
    console.log('Fallo el registro');
    res.send({error: 'fallo en el registro'})
})

router.post("/login", passport.authenticate("login",{failureRedirect:"api/sessions/failedLogin",
session:false}),(req,res)=>{
    const serializedUser ={
        id: req.user._id,
        name : `${req.user.first_name} ${req.user.last_name}`,
        role: req.user.rol,
        email:req.user.email
    };
    const token = jwt.sign(serializedUser, 'CodeerSecret',{expiresIn:"1h"});
    console.log(token);
    res.cookie('coderCookie',token,{maxAge:3600000}).send({
        status:"succes",
        payload:serializedUser
    })
})

router.get("/faillogin", (req,res)=>{
    res.send({error:"fail login"})
})

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect("/")
});


router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'No se pudo desloguear'
            })
        }
        res.redirect('/login')
    })
})

router.post("/restartPassword", async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send(
        res.send({
            status:"error",
            message:"Datos incorrectos"
        })
    )
    const user = await UserModel.findOne({email});
    if(!user) return res.status(400).send(
        res.send({
            status:"error",
            message:"No existe el usuario"
        })
    )
    const newHashPassword = createHash(password);

    await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
    res.send({
        status:"success",
        message:"contraseña restaurada"
    })
})
export default router;