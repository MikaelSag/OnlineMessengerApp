import { useAuth } from "../AuthContext";
import Message from "./Message";

export default function Conversation(props) {
    const { userId } = useAuth();

    return (
        <div className="grow">
            {props.messages.messages.length !== undefined ? (
                props.messages.messages.map((item) => (
                    <Message
                        side={
                            item.sender_id === userId.userId ? "right" : "left"
                        }
                        content={item.content}
                        username={props.messages.username}
                    />
                ))
            ) : (
                <></>
            )}
        </div>
    );
}
