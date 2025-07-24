import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import HospitalTrashed from "./HospitalTrashed";
import UserTrashed from "./UserTrashed";

const items = [
    { label: 'Hospitales', icon: 'pi pi-building' },
    { label: 'Usuarios', icon: 'pi pi-user' },
  ];

export default function ListTrash() {

    const [activeIndex, setActiveIndex] = useState(0);

    const onTabChange = (e) => {
        setActiveIndex(e.index);
    };

    const showActiveTab = () => {
        switch (activeIndex) {
            case 0:
                return <HospitalTrashed />;
            case 1:
                return <UserTrashed />;
            default:
                return <div />;
        }

    }

    return (
        <AdminLayout>
            <Head title="Papelera" />
            <div className="py-8 px-15">
                <div className="max-w-auto mx-auto sm:px-4 lg:px-8">
                    <div className="bg-white lg:h-160 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white">
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">Papelera</h2>
                        </div>
                        <TabMenu 
                            model={items} 
                            activeIndex={activeIndex} 
                            onTabChange={onTabChange} 
                            className='mb-10'
                            />
            
                            {showActiveTab()}
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}