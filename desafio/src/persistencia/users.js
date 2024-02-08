
class UserDB{
    constructor(){
        this.users = [];
    }
    get(){
        return this.users;
    }
    save(user){
        this.users.push(user)
        return "Usuario guardado"
    }
}

export {UserDB};