import userModel from "../../../DB/Models/user.model.js";
import { generateToken } from "../../Utils/generate&verfiyToken.js";
import { compary, hash } from "../../Utils/hash&compery.js";

export const getAllUser = async (req , res , next) => {
    const users = await userModel.find({_id :{ $ne : req.params.userId}})
    .select(["userName", "email", "_id", "avatarImage"]);
    return res.status(200).json({message : "Done" , users});
}
export const register =  async(req , res , next) => {
    const {userName , email , password} = req.body;
    console.log({userName , email , password});
    if (await userModel.findOne({email})) {
        return next(new Error("email already exsit" , {cause : 409}))
    }
    const hashPassword = hash({plaintext : password});
    const user = await userModel.create({userName , email , password : hashPassword});
    return res.status(201).json({message : "Done" , user})
}
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return next(new Error("User not Register"), { cause: 404 });
    }
    
    if (!compary({ plaintext: password, hashValue: user.password })) {
        return next(new Error("In-valid login data."), { cause: 409 });
    }
    const access_token = generateToken({ payload: { _id: user._id, userName: user.userName , avatarImage : user.avatarImage}, expiresIn: 60 * 60 * 24 * 7});
    user.isLogin = "login";
    await user.save();
    return res.status(200).json({ message: "Done", access_token });
}
export const setAvatar = async (req , res , next) => {
    const {userId} = req.params;
    const {avatarImage} = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new Error("user not register") , {cause : 404});
    }
    if (!avatarImage) {
        return next(new Error("must select image") , {cause : 400});
    }
    const userData = await userModel.findByIdAndUpdate(userId , {
        avatarImage,
        isAvatarImageSet : true
    },{
        new : true
    });
    return res.status(200).json({message : "Done" , userData , isSet : userData.isAvatarImageSet , image : userData.avatarImage});
}