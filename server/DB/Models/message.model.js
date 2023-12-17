import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    message: {
        text: { type: String, required: true }
    },
    users : Array,
    sender : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true}
},{
    timestamps : true
});

const messageModel = mongoose.models.Message || mongoose.model("Message" , messageSchema);
export default messageModel;