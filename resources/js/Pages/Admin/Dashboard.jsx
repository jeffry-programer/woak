import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Button } from 'primereact/button';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            You're logged in!
                        </div>
                        <div className="card flex justify-content-center">
                            <Button label="Check" icon="pi pi-check" />
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}