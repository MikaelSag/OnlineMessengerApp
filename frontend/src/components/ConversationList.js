import { useEffect, useState } from "react";
import ConversationPreview from "./ConversationPreview";

export default function ConversationList(props) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const data = {
            user_id: props.userId.userId,
        };

        fetch("http://localhost:8000/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((response) => {
                setConversations(response);
            });
    }, [props.conversationId]);

    const handleDelete = (conversationId) => {
        const data = {
            conversation_id: conversationId,
        };

        fetch("http://localhost:8000/deleteConversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) =>
            setConversations(
                conversations.filter(
                    (obj) => obj.conversation_id !== conversationId
                )
            )
        );
    };

    console.log(conversations);

    const conversationList = conversations.map((item) => (
        <ConversationPreview
            username={item.username}
            changeConversation={props.changeConversation}
            conversationId={item.conversation_id}
            handleDelete={handleDelete}
        />
    ));

    return <div>{conversationList}</div>;
}
