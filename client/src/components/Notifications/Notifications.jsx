import moment from "moment";
import { useCallback, useState } from "react";
import "./Notifications.modules.scss";

const Notifications = ({ notifications, contacts, setNotifications, setCurrentChat, setCurrentSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    // dubicate
    const unreadNotificationFun = () => {
        return notifications?.filter((n) => n.isRead === false)
    }
    const modifyNotifictions = notifications?.map((n) => {
        const sender = contacts?.find((user) => user._id === n.senderId);
        return { ...n, senderName: sender?.userName }
    });

    const markAlNotifictionsAsRead = useCallback(() => {
        const markNotifictionsAllRead = notifications?.map((n) => {
            return { ...n, isRead: true };
        });
        setNotifications(markNotifictionsAllRead);
    }, []);


    const markNotifictionsAsReadOpenBox = useCallback((n, notifications) => {
        // find chat to open
        const chatMembers = contacts?.find((contact) => contact._id === n.senderId);

        // mark notification as read 
        const mNotificatins = notifications?.map((el) => {
            if (n.senderId === el.senderId) {
                return { ...n, isRead: true };
            } else {
                return el;
            }
        });

        setCurrentChat(chatMembers);
        setNotifications(mNotificatins);
    }, [])


    return (
        <div className="notifications pt-2 h3 text-white">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <i className="fa-solid fa-message"></i>
                {unreadNotificationFun()?.length === 0 ? null : (
                    <span className="position-absolute start-100 translate-middle badge rounded-pill"
                        style={{ backgroundColor: "#997af0", top: "3px" }}>
                        <span>{unreadNotificationFun()?.length}</span>
                    </span>
                )}
            </div>
            {
                isOpen ? (
                    <div className="notifications-box">
                        <div className="notifications-header flex-column">
                            <h3>notifictions</h3>
                            <div className="mark-as-read text-white" onClick={markAlNotifictionsAsRead}>
                                mark all read
                            </div>
                            {
                                modifyNotifictions?.length === 0 ? <span className="notification">No notification yet...</span> : null
                            }
                            {
                                modifyNotifictions && modifyNotifictions.map((n, index) => {
                                    return <div key={index} className={n.isRead ? "notification" : "notification not-read"}
                                        onClick={() => {
                                            markNotifictionsAsReadOpenBox(n, notifications);
                                            setIsOpen(false);
                                            setCurrentSelected(n.senderId);
                                        }}>
                                        <span>{`${n.senderName} sent you a new message`}</span>
                                        <span className="notification-time">{moment(n.date).calendar()}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                )
                : null}
        </div>
    )
}

export default Notifications
