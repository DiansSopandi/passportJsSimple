import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    googleId : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    }
},{
    timestamps : true
}
);

const User = model('user', userSchema);
export default User;