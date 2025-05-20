import ConversationList from "./components/ConversationList";
import Chat from "./components/Chat";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

function App() {
    const [conversation, setConversation] = useState("");
    const [newConversationUsername, setNewConversationUsername] = useState("");
    const { userId } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setNewConversationUsername(event.target.value);
    };

    const changeConversation = (conversation) => {
        setConversation(conversation);
    };

    const createNewConversation = () => {
        const data = {
            receiver_participant: newConversationUsername,
            sender_participant: userId.userId,
        };

        fetch("http://localhost:8000/createConvo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((response) => setConversation(response.conversation_id));
    };

    return (
        <div className="flex flex-col w-screen h-screen">
            <header className="flex items-center justify-between w-full h-16 px-4 text-white bg-slate-800">
                <h1 className="text-xl font-bold">CometChat</h1>
                <div>
                    <button
                        className="btn"
                        onClick={() =>
                            document
                                .getElementById("new_conversation_modal")
                                .showModal()
                        }
                    >
                        <FaPlus />
                    </button>
                    <dialog id="new_conversation_modal" className="modal">
                        <div className="flex content-center justify-center modal-box">
                            <input
                                type="text"
                                placeholder="Enter username"
                                onChange={handleChange}
                                value={newConversationUsername}
                                className="w-full input input-bordered"
                            />
                            <button
                                className="ml-4 btn"
                                onClick={() => {
                                    document
                                        .getElementById(
                                            "new_conversation_modal"
                                        )
                                        .close();
                                    createNewConversation();
                                    setNewConversationUsername("");
                                }}
                            >
                                <FaPlus />
                            </button>
                        </div>

                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
                <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" className="m-1">
                        <div className="avatar placeholder">
                            <div className="w-10 rounded-full bg-neutral text-neutral-content">
                                <span className="text-xs">
                                    {userId.username.substring(0, 1)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                        <li>
                            <button onClick={() => navigate("/login")}>
                                Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            </header>

            <div data-theme="dark" className="flex flex-grow h-full">
                <aside className="text-white w-80 bg-slate-700">
                    <ConversationList
                        userId={userId}
                        conversationId={conversation}
                        changeConversation={changeConversation}
                    />
                </aside>
                <main className="flex flex-grow bg-slate-400">
                    <Chat conversationId={conversation} />
                </main>
            </div>
        </div>
    );
}

export default App;
