import { Router } from "express";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { getAllUser, login, register, setAvatar } from "./auth.controller.js";


const authRouter = Router();

authRouter.get("/allUsers/:userId" , asyncHandler(getAllUser));
authRouter.post("/register" , asyncHandler(register));
authRouter.post("/login" , asyncHandler(login));
authRouter.post("/setAvatar/:userId" , asyncHandler(setAvatar));

export default authRouter;