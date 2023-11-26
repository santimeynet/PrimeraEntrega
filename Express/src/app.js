import express from "express";

const PORT = 8080;

const app = express();

app.get('/saludo',(req, res)=>{
    res.send('Hola Coders, desde express')
})

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`)
})