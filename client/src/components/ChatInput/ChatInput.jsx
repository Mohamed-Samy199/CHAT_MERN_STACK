import Picker from "emoji-picker-react";
import { useState } from "react";

const ChatInput = ({ handleSendMessage, socket }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");

    const handleEmojiShowHiden = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick = (emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    }
    const sendMessage = (event) => {
        event.preventDefault();
        if (!msg) return;
        if (msg.length > 0) {
            handleSendMessage(msg);
            setMsg("");
        }
    }

    const handleInputChange = (event) => {
        setMsg(event.target.value);
        socket.current.emit("typing");
    };
    const handleKeyUp = () => {
        socket.current.emit("stopTyping");
    };

    return (
        <div className="chat-input-container mx-3">
            <div className="button-container d-flex align-items-center gap-2 text-white">
                <div className="emoji fs-4 position-relative">
                    <i className="fa-solid fa-face-smile" onClick={handleEmojiShowHiden} style={{ cursor: "pointer", color: "#ffff00c8" }}></i>
                    <div className="emoji-box position-absolute" style={{ top: "-463px" }}>
                        {
                            showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} searchDisabled />
                        }
                    </div>
                </div>
                <form onSubmit={(e) => sendMessage(e)} className="input-container d-flex align-items-center w-100 gap-3 rounded-5" style={{ backgroundColor: "#ffffff36" }}>
                    <input type="text" className="fs-4 ps-3 border-0" placeholder="type your message"
                        value={msg}
                        onChange={handleInputChange}
                        onKeyUp={handleKeyUp}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                sendMessage(e);
                            }
                        }} />
                    <button className="submit d-flex justify-content-center align-items-center rounded-5 text-white py-2 px-4" style={{ backgroundColor: "#997af0" }}>
                        <i className="fa-solid fa-paper-plane fs-4"></i>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatInput