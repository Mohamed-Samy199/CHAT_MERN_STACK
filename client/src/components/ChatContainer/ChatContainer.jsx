import { Fragment, useEffect, useState } from "react";
import Logout from "../Logout/Logout";
import ChatInput from "../ChatInput/ChatInput";
import Messages from "../Messages/Messages";
import { toast } from "react-toastify";
import axios from "axios";
import Notifications from "../Notifications/Notifications";

const ChatContainer = ({
    currentUser,
    currentChat,
    logout,
    socket,
    contacts,
    setCurrentChat,
    handleChatChange,
    setCurrentSelected,
    notifications,
    setNotifications,
}) => {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
    const handleGetAllMessages = async () => {
        try {
            if (currentChat) {
            const { data } = await axios.get(
                `http://localhost:5000/message/${currentUser?._id}/${currentChat?._id}`
            );
            setMessages(data.projectMessage);
            }
        } catch (error) {
            console.error(error);
            toast.error(
            error.response?.data?.message || "Error fetching messages"
            );
        }
    };

    handleGetAllMessages();
    }, [currentChat]);

    const handleSendMessage = async (msg) => {
        try {
        await axios.post("http://localhost:5000/message", {
            message: {
            text: msg,
        },
        from: currentUser._id,
        to: currentChat._id,
    });

    const newMessage = { fromSelf: true, message: msg };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.current.emit("send-msg", {
        from: currentUser._id,
        to: currentChat._id,
        messages: {
            text: msg,
        },
    });
    } catch (error) {
        console.error(error);
        toast.error(
            error.response?.data?.message || "Error sending message"
        );
        }
    };

    useEffect(() => {
        if (socket.current) {
        socket.current.on("msg-recieve", (msg) => {
            setMessages((prev) => [
            ...prev,
            { fromSelf: false, message: msg },
            ]);
        });

        socket.current.on("getNotification", (res) => {
            const isOpenChat = currentChat?._id === res.senderId;
            if (isOpenChat) {
            setNotifications((prev) => [
                { ...res, isRead: isOpenChat, data: new Date() },
                ...prev,
            ]);
        } else {
            setNotifications((prev) => [res, ...prev]);
        }
    });

    socket.current.on("userTyping", () => {
        setTyping(true);
    });
    socket.current.on("userStopTyping", () => {
        setTimeout(() => {
        setTyping(false);
        }, 1100);
    });

    return () => {
        socket.current.off("msg-recieve");
        socket.current.off("getNotification");
        };
    }
    }, [socket]);

    return (
        <Fragment>
        {currentChat && (
            <div className="chats-container pt-2 d-grid overflow-hidden gap-1" style={{ gridTemplateRows: "10% 78% 12%" }}>
                <div className="chat-header d-flex justify-content-between align-items-center p-1 ps-2 pt-2" style={{ backgroundColor: "#080420" }}>
                    <div className="user-details d-flex align-items-center gap-3">
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" style={{ height: "3rem" }} />
                        </div>
                        <div className="userName">
                            <h3 className="text-white pt-2">{currentChat.userName}</h3>
                        </div>
                        <div className="user-type pt-2">
                            <p style={{ color: "#997af0" }}>{typing ? "typing..." : ""}</p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <Notifications
                        notifications={notifications}
                        currentChat={currentChat}
                        currentUser={currentUser}
                        setCurrentSelected={setCurrentSelected}
                        setCurrentChat={setCurrentChat}
                        setNotifications={setNotifications}
                        contacts={contacts}
                        changeChat={handleChatChange}
                        />
                        <Logout logout={logout} />
                    </div>
                </div>
                <Messages messages={messages} />
                <ChatInput handleSendMessage={handleSendMessage} socket={socket} />
            </div>
        )}
    </Fragment>
    );
};

export default ChatContainer;











// import { Fragment, useEffect, useState } from "react";
// import Logout from "../Logout/Logout";
// import ChatInput from "../ChatInput/ChatInput";
// import Messages from "../Messages/Messages";
// import { toast } from "react-toastify";
// import axios from "axios";
// import Notifications from "../Notifications/Notifications";

// const ChatContainer = ({ currentUser, currentChat, logout, socket , contacts , setCurrentChat , handleChatChange , 
//                         setCurrentSelected , notifications, setNotifications}) => {

//     const [messages, setMessages] = useState([]);
//     const [typing, setTyping] = useState(false);

//     useEffect(() => {
//         const handleGetAllMessages = async () => {
//             try {
//                 if (currentChat) {
//                     const { data } = await axios.get(`http://localhost:5000/message/${currentUser?._id}/${currentChat?._id}`);
//                     setMessages(data.projectMessage);
//                 }
//             } catch (error) {
//                 console.error(error);
//                 toast.error(error.response?.data?.message || "Error fetching messages");
//             }
//         };

//         handleGetAllMessages();
//     }, [currentChat]);

//     const handleSendMessage = async (msg) => {
//         try {
//             await axios.post("http://localhost:5000/message", {
//                 message: {
//                     text: msg,
//                 },
//                 from: currentUser._id,
//                 to: currentChat._id,
//             });

//             socket.current.emit("send-msg", {
//                 from: currentUser._id,
//                 to: currentChat._id,
//                 messages: {
//                     text: msg,
//                 },
//             });
//         } catch (error) {
//             console.error(error);
//             toast.error(error.response?.data?.message || "Error sending message");
//         }
//     };
//     useEffect(() => {
//         if (socket.current) {
//             socket.current.on("msg-recieve", (msg) => {
//                 setMessages((prev) => [...prev, { fromSelf: false, message: msg }]);
//             });

//             socket.current.on("getNotification", (res) => {
//                 const isOpenChat = currentChat?._id === res.senderId;
//                 if(isOpenChat){
//                     setNotifications((prev) => [
//                         { ...res, isRead: isOpenChat, data: new Date() },
//                         ...prev,
//                     ]);
//                 }
//                 else{
//                     setNotifications((prev) => [res, ...prev]);
//                 }
//             });

//             socket.current.on("userTyping", () => {
//                 setTyping(true);
//             });
//             socket.current.on("userStopTyping", () => {
//                 setTimeout(() => {
//                     setTyping(false);
//                 }, 1100);
//             });
            

//             return () => {
//                 socket.current.off("msg-recieve");
//                 socket.current.off("getNotification");
//             };
//         }
//     }, [socket, currentChat]);



//     return (
//         <Fragment>
//             {currentChat && (
//                 <div className="chats-container pt-2 d-grid overflow-hidden gap-1" style={{ gridTemplateRows: "10% 78% 12%" }}>
//                     <div className="chat-header d-flex justify-content-between align-items-center p-1 ps-2 pt-2" style={{ backgroundColor: "#080420" }}>
//                         <div className="user-details d-flex align-items-center gap-3">
//                             <div className="avatar">
//                                 <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" style={{ height: "3rem" }} />
//                             </div>
//                             <div className="userName">
//                                 <h3 className="text-white pt-2">{currentChat.userName}</h3>
                                
//                                 <p style={{color : "#997af0"}}>{typing ? "typing..." : ""}</p>
//                             </div>
//                         </div>
//                         <div className="d-flex justify-content-center align-items-center gap-3">
//                         <Notifications notifications={notifications} currentChat={currentChat} currentUser={currentUser} setCurrentSelected={setCurrentSelected}
//                         setCurrentChat={setCurrentChat} setNotifications={setNotifications} contacts={contacts} changeChat={handleChatChange}/>
//                         <Logout logout={logout} />
//                         </div>
//                     </div>
//                     <Messages messages={messages} />
//                     <ChatInput handleSendMessage={handleSendMessage}  socket={socket}/>
//                 </div>
//             )}
//         </Fragment>
//     );
// };

// export default ChatContainer;





