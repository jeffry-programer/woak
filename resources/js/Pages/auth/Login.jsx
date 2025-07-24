// Import Dependencies
import { Head, useForm, router } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { Toast } from 'primereact/toast';
import { useRef } from "react";

// Local Imports
import imgLogin from "@/img/img-login.png";
import appLogo from "@/img/appLogo.png";

// ----------------------------------------------------------------------

export default function SignIn() {

    const toast = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        console.log('Intentando enviar solicitud de login', data);

        router.post('/login', data, {
            onSuccess: () => {
            toast.current.show({ severity: 'success', summary: 'Login Success', detail: 'Welcome!' });
            },
            onError: () => {
            toast.current.show({ severity: 'error', summary: 'Login failed', detail: 'Unexpected Error' });
            }
        });
    };

  return (
    <main className="min-h-screen flex items-center justify-center">
        <Toast ref={toast} />
        <Head title="Login" />
        <div className="absolute right-10 top-10">
            <img src={appLogo}  className ="w-30 " alt="" />
        </div>
        <div className="max-w-6xl p-4 sm:p-6 md:p-10 sm:mt-20 md:mt-0">
            <div className="justify-center sm:block md:flex">
                <div className="md:w-1/2">
                    <img src={imgLogin} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="md:w-2/5 rounded-lg p-4 sm:p-6 md:py-4 md:px-10 align-middle my-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-400 mt-4 mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Please sign in to continue</p>
                    </div>
            
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div className="card flex justify-content-center p-font-sm mb-4">
                                <div className=" flex-column gap-2 w-full">
                                    <label htmlFor="email">Email</label>
                                    <InputText 
                                        id="email"
                                        name="email"
                                        required
                                        value={data.email} 
                                        aria-describedby="email-help" 
                                        className="w-full p-inputtext-sm"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        } 
                                    />
                                    <small id="email-help">
                                        Enter your username.
                                    </small>
                                </div>
                            </div>
                            <div className="card flex justify-content-center p-font-sm mb-4">
                                <div className=" flex-column gap-2 w-full">
                                    <label htmlFor="password">Password</label>
                                    <InputText 
                                        type="password"
                                        name="password"
                                        id="password" 
                                        required
                                        aria-describedby="password-help" 
                                        className="w-full p-inputtext-sm" 
                                        onChange={(e) =>
                                            setData("password",e.target.value)
                                        }
                                    />
                                    <small id="password-help">
                                        Enter your password.
                                    </small>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full p-button-sm p-button-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded"
                        >
                            Sign In
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-gray-400 dark:text-gray-300">Don't have an account? <a href="#" className="text-gray-600 dark:text-gray-200 hover:text-gray-700 hover:underline">Create one</a></p>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}