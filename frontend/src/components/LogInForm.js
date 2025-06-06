import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogInForm() {
    const [errorMessage, setErrorMessage] = useState("");
    const { setUserId } = useAuth();
    const navigate = useNavigate();

    async function loginDB(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const data = {
            username: username,
            password: password,
        };
        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok && result.login) {
                setUserId({
                    userId: result.user_id,
                    username: result.username,
                });
                console.log("Username set in context:", result.user_id);
                navigate("/chat");
            } else {
                console.log(result);
                setErrorMessage("Invalid username or password.");
            }
        } catch (error) {
            alert("An error occurred.");
        }
    }

    return (
        <form class="max-w-sm mx-auto" onSubmit={loginDB}>
            <div class="mb-5">
                <label
                    htmlFor="username"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    required
                />
            </div>
            <div class="mb-5">
                <label
                    htmlFor="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Password"
                    required
                />
            </div>
            <input
                type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                value="Log In"
            />
            {errorMessage && (
                <div className="mt-4 text-sm text-red-500">{errorMessage}</div>
            )}
        </form>
    );
}
