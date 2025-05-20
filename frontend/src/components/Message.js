import { useAuth } from "../AuthContext";

export default function Message(props) {
    const { userId } = useAuth();

    return (
        <div
            className={`chat ${
                props.side === "left" ? " ml-4 chat-start" : "mr-4 chat-end"
            }`}
        >
            <div className="chat-image avatar placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    <span className="text-xs">
                        {props.side === "right"
                            ? userId.username.substring(0, 1)
                            : props.username.substring(0, 1)}
                    </span>
                </div>
            </div>
            <div className="chat-bubble">{props.content}</div>
        </div>
    );
}
