import { useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa6";

export default function ChatInput(props) {
    const [message, setMessages] = useState("");

    const handleChange = (event) => {
        setMessages(event.target.value);
    };

    return (
        <label class="input input-bordered flex items-center gap-2 grow">
            <input
                type="text"
                class="grow"
                placeholder="Type here..."
                onChange={handleChange}
                value={message}
            />
            <button
                onClick={() => {
                    props.handleSubmit(message);
                    setMessages("");
                }}
            >
                <FaRegPaperPlane />
            </button>
        </label>
    );
}
