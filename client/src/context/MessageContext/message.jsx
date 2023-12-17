
// import { Fragment, useEffect, useState } from "react"
// import Logout from "../Logout/Logout";
// import ChatInput from "../ChatInput/ChatInput";
// import Messages from "../Messages/Messages";
// import { toast } from "react-toastify";
// import axios from "axios";

// const ChatContainer = ({ currentUser, currentChat, logout , socket }) => {
//     const [messages, setMessages] = useState([]);
//     const [arrivalMessage , setArrivalMessage] = useState(null);
//     const [notifications , setNotifications] = useState([]);
//     console.log("===============>" , notifications);
//     const handleGetAllMessages = async () => {
//         try {
//             if (currentChat) {
//                 let { data } = await axios.get(`http://localhost:5000/message/${currentUser?._id}/${currentChat?._id}`);
//                 setMessages(data.projectMessage);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.message);
//         }
//     };
//     useEffect(() => {
//         handleGetAllMessages()
//     }, [currentChat]);
//     const handleSendMessage = async (msg) => {
//         try {
//             await axios.post("http://localhost:5000/message", {
//                 message: {
//                     text: msg
//                 },
//                 from: currentUser._id,
//                 to: currentChat._id
//             });
//             await socket.current.emit("send-msg" , {
//                 from : currentUser._id,
//                 to : currentChat._id,
//                 messages : {
//                     text : msg
//                 }
//             });
//             const msgs = [...messages];
//             msgs.push({fromSelf : true , message : msg});
//             setMessages(msgs);

//         } catch (error) {
//             console.log(error);
//             if (error || error.response.status === 400) {
//                 toast.error(error.response.data.message);
//             }
//         }
//     }
//     useEffect(() => {
//         console.log("..........>",socket.current);
//         if (socket.current) {
//             socket.current.on("msg-recieve", (msg) => {
//                 setArrivalMessage({ fromSelf: false, message: msg });
//             });

//             socket.current.on("getNotification" , (res) => {
//                 console.log(res);
//                 const isOpenChat = currentChat?._id === res.senderId;
//                 if (isOpenChat) {
//                     setNotifications((prev)=> [{...res , isRead : true} , ...prev]);
//                 }else{
//                     setNotifications((prev)=> [res , ...prev]);
//                 }
//             })

//             return () => {
//                 socket.current.off("msg-recieve");
//                 socket.current.off("getNotification");
//             };
//         }
//     }, [socket, arrivalMessage , messages , notifications , currentChat]);

//     // useEffect(()=>{
//     //     if(socket){
//     //         console.log(socket.current);
//     //         socket.current?.on("msg-recieve", (msg)=>{
//     //             // console.log(msg);
//     //             setArrivalMessage({fromSelf : false , message : msg})
//     //         })
//     //     }
//     // },[socket , messages , arrivalMessage , currentChat , currentUser]);
//     useEffect(()=>{
//         arrivalMessage && setMessages((prev)=>[...prev , arrivalMessage]);
//     },[arrivalMessage]);

//     return (
//         <Fragment>
//             {currentChat && (
//                 <div className="chats-container pt-2 d-grid overflow-hidden gap-1" style={{gridTemplateRows : "10% 78% 12%"}}>
//                     <div className="chat-header d-flex justify-content-between align-items-center p-1 ps-2 pt-2" style={{ backgroundColor: "#080420" }}>
//                         <div className="user-details d-flex align-items-center gap-3">
//                             <div className="avatar">
//                                 <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" style={{ height: "3rem" }} />
//                             </div>
//                             <div className="userName">
//                                 <h3 className="text-white pt-2">{currentChat.userName}</h3>
//                             </div>
//                         </div>
//                         <Logout logout={logout} />
//                     </div>
//                     <Messages messages={messages}/>
//                     <ChatInput handleSendMessage={handleSendMessage} />
//                 </div>
//             )}
//         </Fragment>
//     )
// }

// export default ChatContainer
