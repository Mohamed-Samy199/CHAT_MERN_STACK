import { Fragment, useEffect, useRef } from "react";
import "./Messages.modules.scss";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const Messages = ({ messages }) => {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="messages d-flex flex-column gap-2 p-3 overflow-auto">
            {
                messages && messages.map((message) => {
                    return (
                        <Fragment key={uuidv4()}>
                            <div ref={scrollRef} className={`message d-flex align-items-center ${message.fromSelf ? "sended" : "recieved"}`}>
                                <div className="content rounded-4 px-3 pt-2">
                                    <p>{message.message}</p>
                                    <p style={{ fontSize: "12px" }}>{moment(message.createdAt).calendar()}</p>
                                </div>

                            </div>
                        </Fragment>
                    )
                })
            }
        </div>
    )
}

export default Messages
