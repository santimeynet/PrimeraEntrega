import mongoose from "mongoose";

const userCollection = "Users";

const usersSchema = new mongoose.Schema({
    first_name:{
        type:String,
        require:true
    },
    last_name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    age: Number,
    password:{
        type:String,
        require:true
    },
    cart:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'carts'
    },
    rol:{
        type:String,
        default:"user"
    }
});

const userModel = mongoose.model(userCollection,usersSchema);

export default userModel;