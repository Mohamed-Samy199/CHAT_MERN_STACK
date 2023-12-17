import { useCallback, useEffect, useState } from "react";
import logo from "../../assets/logo.svg";
import "./Contacts.modules.scss";
import OnlineUser from "../OnlineUser/OnlineUser";

const Contacts = ({ contacts, currentUser, changeChat, onlineUsers, currentSelected, setCurrentSelected, notifications, setNotifications }) => {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    
    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser.userName);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

    const unreadNotificationFun = () => {
        return notifications?.filter((n) => n.isRead === false)
    }
    const allContacts = contacts.map((contact) => contact._id);
    const forThisUserNotification = unreadNotificationFun()?.filter((n) => allContacts.includes(n.senderId));

    const markThisNotificationAsRead = useCallback(() => {
        // mark notifications as read
        const mNotificatins = notifications?.map((el) => {
            let notification;
            forThisUserNotification?.forEach((n) => {
                if (n.senderId === el.senderId) {
                    notification = { ...n, isRead: true };
                } else {
                    notification = el;
                }
            });
            return notification;
        });
        setNotifications(mNotificatins);
    }, [])
    return (
        <div>
            {currentUserImage && currentUserName && (
                <div className="contact-container gap-1">
                    <div className="brand d-flex justify-content-center align-items-center gap-2">
                        <img src={logo} alt="logo" />
                        <h3 className="text-white text-uppercase pt-2">snappy</h3>
                    </div>
                    <OnlineUser onlineUsers={onlineUsers} contacts={contacts} />
                    <div className="contacts d-flex flex-column justify-content-center align-items-center">
                        {Array.isArray(contacts) && contacts.length > 0 ? (
                            contacts.map((contact) => {
                                return (
                                    <div
                                        className={`contact ${contact._id === currentSelected ? "selected" : ""}`}
                                        key={contact._id} onClick={() => {
                                            markThisNotificationAsRead();
                                            changeCurrentChat(contact._id, contact)
                                        }}
                                    >
                                        <div className="content-contacts d-flex align-items-center gap-3">
                                            <div className="avatar">
                                                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                            </div>
                                            <div className="userName">
                                                <h3 className="text-white">{contact.userName}</h3>
                                            </div>
                                        </div>

                                        <div className="text-notifications">
                                            <p className={forThisUserNotification?.filter((n) => n.senderId === contact._id).length > 0 ? "this-user-notifications" : ""}>
                                                {forThisUserNotification?.filter((n) => n.senderId === contact._id).length > 0 ?
                                                    forThisUserNotification?.filter((n) => n.senderId === contact._id).length : ""}
                                            </p>
                                        </div>

                                        <span className={onlineUsers?.some((user) => user.userId === contact._id) ? "user-online" : ""}></span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="fw-bold text-white">No contacts available</div>
                        )}

                    </div>
                    <div className="current-user pb-2  d-flex justify-content-center align-items-center gap-2">
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${currentUser.avatarImage}`} alt="avatar" />
                        </div>
                        <div className="userName">
                            <h2 className="text-white">{currentUser.userName}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;