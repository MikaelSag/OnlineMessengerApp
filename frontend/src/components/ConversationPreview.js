import { FaRegTrashAlt } from "react-icons/fa";

export default function ConversationPreview(props) {
    return (
        <button
            className="w-full"
            onClick={() => props.changeConversation(props.conversationId)}
        >
            <div className="flex flex-row items-center justify-between p-4 border-b border-slate-500">
                {/* Profile Picture and Username */}
                <div className="flex items-center">
                    {/* Profile Picture */}
                    <div className="avatar placeholder">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral text-neutral-content">
                            <span className="text-xs">
                                {props.username.substring(0, 1)}
                            </span>
                        </div>
                    </div>
                    {/* Username */}
                    <div className="pl-2">
                        <h1 className="font-semibold text-white">
                            {props.username}
                        </h1>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        props.handleDelete(props.conversationId);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-500"
                >
                    <FaRegTrashAlt />
                </button>
            </div>
        </button>
    );
}
