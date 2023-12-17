let stackValue;
export const asyncHandler = (API) => {
    return (req , res , next) => {
        API(req , res , next).catch(err => {
            stackValue = err.stack;
            return next(new Error(err) , {cause : 500});
        })
    }
}

export const globalErrorHandle = (err , req , res , next) => {
    if (err) {
        if (process.env.MOOD === "DEV") {
            return res.status(err.cause || 500).json({message : err.message , err , stack : stackValue});
        }
        return res.status(err.cause || 500).json({message : err.message });
    }
}