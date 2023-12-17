import express from "express";
import initApp from "./src/initApp.js";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
config({ path: './config/.env' });
const port = process.env.PORT || 8080;

const server = createServer(app);
initApp(app, express);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

let onlineUsersNow = [];

io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        onlineUsersNow.push({
            userId,
            socketId: socket.id,
        });
        io.emit("getOnlineUsers", onlineUsersNow);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsersNow.find((user) => user.userId === data.to);
        if (sendUserSocket) {
            io.to(sendUserSocket.socketId).emit("msg-recieve", data.messages.text);
            io.to(sendUserSocket.socketId).emit("getNotification", {
                isRead: false,
                senderId: data.from,
                date: new Date(),
            });
        }
    });

    // Typing
    socket.on("typing" , ()=>{
        socket.broadcast.emit('userTyping')
    });
    socket.on("stopTyping" , ()=>{
        socket.broadcast.emit('userStopTyping')
    });

  // Disconnect

    socket.on("disconnect", () => {
        onlineUsersNow = onlineUsersNow.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsersNow);
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));




// import express from "express";
// import initApp from "./src/initApp.js";
// import { config } from "dotenv";
// import { Server } from "socket.io";

// const app = express();
// config({ path: './config/.env' });
// const port = process.env.PORT || 8080;

// initApp(app, express);

// const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

// // const io = new Server(server , {
// //     cors : {
// //         origin : "http://127.0.0.1:5173/",
// //         credentials : true
// //     }
// // });
// const io = new Server(server, {
//     cors: "*"
// });
// let onlineUsersNow = [];
// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//     // global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, socket.id);
//     });

//     // my touch
//     socket.on("addNewuser-onlineUsers", (userId) => {
//         // console.log(userId);
//         !onlineUsersNow.some((user) => user.userId === userId) &&
//             onlineUsersNow.push({
//                 userId,
//                 socketId: socket.id
//             });
//         // console.log(onlineUsersNow);
//         io.emit("getOnlineUsers" , onlineUsersNow);
//     });

//     socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         // console.log(sendUserSocket);
//         console.log("==-=-=-=->",data.from);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit("msg-recieve", data.messages.text);
//             socket.to(sendUserSocket).emit("getNotification" , {
//                 isRead : false,
//                 senderId : data.from,
//                 data : new Date()
//             });
//         }
//     });


//     socket.on("disconnect", () => {
//         onlineUsersNow = onlineUsersNow.filter((user) => user.socketId !== socket.id);
//         io.emit("getOnlineUsers", onlineUsersNow);
//     });
// });

// ***********************************************************************************

// import express from "express";
// import initApp from "./src/initApp.js";
// import { config } from "dotenv";
// import { Server } from "socket.io";

// const app = express();
// config({ path: './config/.env' });
// const port = process.env.PORT || 8080;

// initApp(app, express);

// const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

// // const io = new Server(server , {
// //     cors : {
// //         origin : "http://127.0.0.1:5173/",
// //         credentials : true
// //     }
// // });
// const io = new Server(server, {
//     cors: "*"
// });
// let onlineUsersNow = [];
// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//     // global.chatSocket = socket;
//     socket.on("add-user", (userId) => {
//         onlineUsers.set(userId, socket.id);
//     });

//     // my touch
//     socket.on("addNewuser-onlineUsers", (userId) => {
//         // console.log(userId);
//         !onlineUsersNow.some((user) => user.userId === userId) &&
//             onlineUsersNow.push({
//                 userId,
//                 socketId: socket.id
//             });
//         console.log(onlineUsersNow);
//         io.emit("getOnlineUsers" , onlineUsersNow);
//     });

//     socket.on("send-msg", (data) => {
//         const sendUserSocket = onlineUsers.get(data.to);
//         if (sendUserSocket) {
//             socket.to(sendUserSocket).emit("msg-recieve", data.messages.text)

//         }
//     });

    
//     socket.on("disconnect", () => {
//         onlineUsersNow = onlineUsersNow.filter((user) => user.socketId !== socket.id);
//         io.emit("getOnlineUsers", onlineUsersNow);
//     });
// })