import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";


export let ChatContext = createContext(null);

export function ChatContextProvider(props) {
    // APP, get and store token =======>
    const [userData, setUserData] = useState(null);
    const saveUserData = () => {
        let encodeToken = localStorage.getItem("token");
        let decodeToken = jwtDecode(encodeToken);
        setUserData(decodeToken);
    }
    // console.log(userData);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            saveUserData();
        }
    }, []);

    let logout = () => {
        localStorage.removeItem("token");
        setUserData(null);
        return <Navigate to="/login" />
    }

    // Chat component =======>
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [onlineUsers , setOnlineUsers] = useState([]);
    const [contacts, setContacts] = useState([]);


    const socket = useRef();

    // Chat
    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem("chat-app-user")) {
                <Navigate to='/login' />
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
                setIsLoading(true);
            }
        }
        fetchData();
    }, []);

    // Chat, connect by sosket
    useEffect(() => {
        if (currentUser) {
            socket.current = io("http://localhost:5000");
            socket.current.emit("add-user", currentUser._id);
            // my touch
            socket.current.emit("addNewuser-onlineUsers" , currentUser._id);
            socket.current.on("getOnlineUsers" , (res)=>{
                setOnlineUsers(res)
            });
            return () => {
                socket.current.off("getOnlineUsers");
            }
        }
    }, [currentUser]);
    // 
    useEffect(() => {
        async function fetchContacts() {
            if (currentUser && userData?._id === currentUser?._id) {
                if (currentUser.isAvatarImageSet) {
                    const response = await axios.get(`http://localhost:5000/user/allUsers/${currentUser._id}`); // ابقي حطلي علامة استفهام currentUser?
                    setContacts(response.data.users);
                }
            }
        }
        fetchContacts();
    }, [currentUser]);

    return <ChatContext.Provider value={{
        // userData,
        // logout,
        // saveUserData,

        // socket,
        // isLoading,
        // currentUser,
        // onlineUsers,
        // contacts
    }}>
        {props.children}
    </ChatContext.Provider>
}