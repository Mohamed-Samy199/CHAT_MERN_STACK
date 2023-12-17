import mongoose from "mongoose"

const DBConnect = async () => {
    return mongoose.connect(process.env.DB_LOCAL)
        .then(res => { console.log(`DB Connection Successful...`) })
        .catch(err => { console.log(`DB Connection fail ${err}`); })
}

export default DBConnect;