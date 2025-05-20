import ResetPasswordForm from "./components/ResetPasswordForm";

export default function PasswordReset() {
    return (
        <div className="flex flex-col w-screen h-screen">
            <header className="items-center w-full h-16 text-center text-white">
                <h1 className="text-xl font-bold">CometChat</h1>
            </header>
            <div data-theme="dark">
                <ResetPasswordForm />
                <br></br>
                <div class="max-w-sm mx-auto">
                    <p>
                        Don't have an account?{" "}
                        <a href="/" class="text-white">
                            Register Here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
