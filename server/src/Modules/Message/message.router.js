import { Router } from "express";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { createMessage, getAllMessages } from "./message.controller.js";

const messageRouter = Router();

messageRouter.post("/" , asyncHandler(createMessage));
messageRouter.get("/:from/:to" , asyncHandler(getAllMessages));

export default messageRouter;