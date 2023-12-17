import "./OnlineUser.modules.scss";

const OnlineUser = ({ onlineUsers, contacts }) => {

    let usersOnline = onlineUsers.map((u) => u.userId);
    let commenUseronline = contacts.filter((contact) => usersOnline.includes(contact._id));

    return (
        <div className="online-users d-flex justify-content-start align-items-center gap-3 ps-2">
            {Array.isArray(commenUseronline) && commenUseronline.length > 0 ? (
                commenUseronline.map((user, index) => {
                    return (
                        <div key={index} className="d-flex justify-content-center align-items-center flex-column position-relative">
                            <div className="avatar">
                                <img src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatar" />
                            </div>
                            <div className="userName">
                                <p className="text-white h6">{user.userName}</p>
                            </div>
                            <span style={{ top: "26px" }} className={onlineUsers?.some((u) => u.userId === user._id) ? "user-online" : ""}></span>
                        </div>
                    );
                })
            ) : (
                <div className="fw-bold text-white">No online users now</div>
            )}
        </div>
    )
}

export default OnlineUser
