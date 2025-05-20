import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";

export default function Chat(props) {
    const [sender, setChatInfo] = useState({ username: "", messages: [] });
    const conversationId = props.conversationId;
    const { userId } = useAuth();

    const handleSubmit = (message) => {
        const data = {
            conversation_id: conversationId,
            user_id: userId.userId,
            content: message,
        };

        fetch("http://localhost:8000/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const newMessages = sender.messages.concat([
            { sender_id: userId.userId, content: message },
        ]);
        console.log(newMessages);
        setChatInfo({
            username: sender.username,
            messages: newMessages,
        });
    };

    useEffect(() => {
        const data = {
            conversation_id: props.conversationId,
            user_id: userId.userId,
        };

        fetch("http://localhost:8000/getConvo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response["detail"] === undefined) {
                    setChatInfo(response);
                }
            });
    }, [props.conversationId]);

    return (
        <div class="flex flex-col grow content-end">
            {sender.username !== "" ? (
                <div className="flex items-center h-16 bg-slate-500">
                    <div className="ml-4">
                        <div className="flex items-center">
                            <div className="avatar placeholder">
                                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                                    <span className="text-s">
                                        {sender.username.substring(0, 1)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h1 className="ml-2 font-semibold text-slate-200">
                                    {sender.username}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center h-16 "></div>
            )}
            <div
                className="flex-grow mt-2 overflow-auto scroll-smooth"
                style={{ maxHeight: "calc(100vh - 197px)" }}
            >
                <Conversation messages={sender} />
            </div>
            <div className="flex items-center justify-center h-16 p-2 bg-slate-800">
                <ChatInput handleSubmit={handleSubmit} />
            </div>
        </div>
    );
}
