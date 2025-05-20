import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import PasswordReset from "./PasswordReset";
import { AuthProvider } from "./AuthContext";

const router = createBrowserRouter([
    {
        path: "/chat",
        element: <App />,
    },

    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <Register />,
    },
    {
        path: "/reset",
        element: <PasswordReset />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);
