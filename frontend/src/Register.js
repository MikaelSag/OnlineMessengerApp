import Form from "./components/RegisterForm";

function Register() {
    return (
        <div className="flex flex-col w-screen h-screen">
            <header className="items-center w-full h-16 text-center text-white">
                <h1 className="text-xl font-bold">Registration</h1>
            </header>
            <div data-theme="dark">
                <Form />
                <br></br>
                <div class="max-w-sm mx-auto">
                    <p>
                        Already have an account?{" "}
                        <a href="/login" class="text-white">
                            Log In Here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
