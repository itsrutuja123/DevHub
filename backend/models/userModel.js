const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    uesrname:{
        type:String,
        required:true,
        unique:true,
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    repositories:[
        {
        default:[],
        type:Schema.Types.ObjectId, //link to repo
        ref:"Repository",
        }
    ],
    followedUsers:[
        {
            default:[],
            type:Schema.Types.ObjectId, //link to repo
            ref:"User",
        },
    ],

    staredRepos:[
        {
            default:[],
            type:Schema.Types.ObjectId, //link to repo
            ref:"Repository",
        },
    ],



});

//creating a model

const User = mongoose.model("User",UserSchema);
module.exports=User;
