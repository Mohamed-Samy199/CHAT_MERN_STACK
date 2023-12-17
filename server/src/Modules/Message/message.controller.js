import messageModel from "../../../DB/Models/message.model.js";

export const createMessage = async (req, res, next) => {
    const { from, to, message } = req.body;
    const dataMessage = await messageModel.create({
        message: { text: message.text }, // Use message.text instead of just message
        users: [from, to],
        sender: from,
    });
    if (!dataMessage) {
        return next(new Error("Fail to send message"), { cause: 400 });
    }
    res.status(201).json({ message: "Done", dataMessage });
};
export const getAllMessages = async (req , res , next) => {
    const {from , to} = req.params;
    if (!from || !to) {
        return next(new Error("in-valid data respones") , {cause : 400});
    }
    const messages = await messageModel.find({
        users : {
            $all : [from , to]
        }
    })
    .sort({updatedAt : 1});
    const projectMessage = messages.map((msg)=> {
        return {
            fromSelf : msg.sender.toString() === from,
            message : msg.message.text,
            createdAt : msg.createdAt,
        }
    });

    return res.status(200).json({message : "Done" , projectMessage});
}