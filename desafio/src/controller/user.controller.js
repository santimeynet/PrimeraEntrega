import { UserService } from "../service/users.service.js";

class UserController{
    static getUsers = (req,res)=>{
        const users = UserService.getUsers();
        res.json({status:"success", data:users});
    }
    static saveUser = (req,res)=>{
        const {name,email,age} = req.body;
        const newUser = {
            name,
            email,
            age
        }
        const result = UserService.saveUser(newUser);
        res.json({status:"success",message:result})
    }
}

export { UserController };