import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    userName: { type: String, required: true, min: 2, max: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAvatarImageSet: { type: Boolean, default: false },
    avatarImage: { type: String, default: "" },
    isLogin : {type : String , enum : ["login" , "not-login"] , default : "not-login" }
},{
    timeseries : true
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;