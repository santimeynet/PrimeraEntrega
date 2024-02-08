import { UserDB } from "../persistencia/users.js";

const userDB = new UserDB();

class UserService{
    static getUsers = () =>{
        const users = userDB.get();
        return users;
    }
    static saveUser = (user) =>{
        const result = userDB.save(user);
        return result;
    }
};

export { UserService };