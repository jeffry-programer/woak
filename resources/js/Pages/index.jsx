import GuestLayout from "../Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Welcome({ user = { name: "Guest" } }) {
    return (
        <GuestLayout>
            <Head title="Welcome" />
            <h1>Welcome</h1>
            <p>Hello {user.name}, welcome to your first Inertia app!</p>
        </GuestLayout>
    );
}
