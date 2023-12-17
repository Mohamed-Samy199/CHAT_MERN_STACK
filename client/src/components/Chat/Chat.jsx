import { useEffect, useRef, useState } from "react";
import "./Chat.modules.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../Contacts/Contacts";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import ChatContainer from "../ChatContainer/ChatContainer";
import { io } from "socket.io-client";

const Chat = ({ logout, userData }) => {

    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);

    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [notifications, setNotifications] = useState([]);
    const socket = useRef()
    const navigate = useNavigate();

    // done
    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
                setIsLoading(true);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io("http://localhost:5000");
            socket.current.emit("add-user", currentUser._id);
            // my touch
            socket.current.emit("addNewuser-onlineUsers", currentUser._id);
            socket.current.on("getOnlineUsers", (res) => {
                setOnlineUsers(res)
            });
            return () => {
                socket.current.off("getOnlineUsers");
            }
        }
    }, [currentUser]);


    useEffect(() => {
        async function fetchContacts() {
            if (currentUser && userData?._id === currentUser?._id) {
                if (currentUser.isAvatarImageSet) {
                    const response = await axios.get(`http://localhost:5000/user/allUsers/${currentUser?._id}`); 
                    setContacts(response.data.users);
                }
            }
        }
        fetchContacts();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }
    return (
        <div className="chat d-flex justify-content-center align-items-center flex-column gap-3">
            <div className="chat-container">
                <Contacts currentChat={currentChat} contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} onlineUsers={onlineUsers}
                    currentSelected={currentSelected} setCurrentSelected={setCurrentSelected} notifications={notifications}
                    setNotifications={setNotifications} />
                {
                    isLoading && currentChat === undefined ? (
                        <WelcomeScreen currentUser={currentUser} />
                    ) : (
                        <ChatContainer currentUser={currentUser} currentChat={currentChat} setCurrentChat={setCurrentChat}
                            socket={socket} logout={logout} contacts={contacts} changeChat={handleChatChange}
                            setCurrentSelected={setCurrentSelected} notifications={notifications} setNotifications={setNotifications} />
                    )
                }
            </div>
        </div>
    );
};

export default Chat;