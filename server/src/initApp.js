import DBConnect from "../DB/connection.js";
import cors from "cors";
import { globalErrorHandle } from "./Utils/asyncHandler.js";
import authRouter from "./Modules/Auth/auth.router.js";
import messageRouter from "./Modules/Message/message.router.js";

const initApp = (app , express) => {
    app.use(express.json({}));
    app.use(cors({}));

    app.get("/" , (req , res)=> console.log(res.send("Chat App")));

    app.use("/user" , authRouter);
    app.use("/message" , messageRouter)

    app.all("*" , (req , res) => {
        return res.json({message : `In-valid Router - can not access this endPoint ${req.originalUrl}`})
    })

    app.use(globalErrorHandle);
    DBConnect();
}

export default initApp;