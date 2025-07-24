import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";
import HospitalImage from "@/img/hospital.png";
import TabContent from "@/Components/TabsContent";
import { useHospitalStore } from "@/store/useHospitalStore";

export default function HospitalDetails() {
    const toast = useRef(null);
    const { hospital, isLoading, error, getOneHospital, setHospital } =
        useHospitalStore();

    const pathname = window.location.pathname;
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    useEffect(() => {
        if (id) {
            getOneHospital(id);
        }
        return () => {
            setHospital(null);
        };
    }, [id, getOneHospital, setHospital]);

    if (isLoading) {
        return (
            <AdminLayout>
                <Head title="Loading Hospital..." />
                <div className="py-12 text-center text-gray-600">
                    Loading hospital details...
                </div>
            </AdminLayout>
        );
    }

    const imageHospitalBuilder = () => {
        if (hospital.image) {
            return (
                window.location.origin + "/storage/" + hospital.image.path_local
            );
        }
        return HospitalImage;
    };

    if (error) {
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error,
            life: 5000,
        });
        return (
            <AdminLayout>
                <Head title="Error" />
                <div className="py-12 text-center text-red-600">
                    <p>Error loading hospital details: {error}</p>
                    <p>Please try again or contact support.</p>
                </div>
            </AdminLayout>
        );
    }

    if (!hospital) {
        return (
            <AdminLayout>
                <Head title="Hospital Not Found" />
                <div className="py-12 text-center text-gray-600">
                    Hospital details not found.
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head title={`Details: ${hospital.hospital_name}`} />
            <Toast ref={toast} />
            <div className="py-12">
                <div className="max-w-auto mx-auto sm:px-8 lg:px-10">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white border-b border-gray-200">
                            <h2 className="text-3xl text-gray-400 mb-4">
                                Hospital Details
                            </h2>
                            <div className="flex flex-wrap -mx-4 mb-5">
                                <div className="w-1/2 md:w-1/3 xl:w-1/3 p-4 mr-3">
                                    <img
                                        src={imageHospitalBuilder()}
                                        alt="Hospital Image"
                                        className="w-full h-70 object-cover"
                                    />
                                </div>
                                <div className="w-1/2 md:w-1/3 xl:w-1/4 p-4">
                                    <h6 className="text-gray-500 mb-2">
                                        Hospital Name
                                    </h6>
                                    <p className="mb-8">
                                        {hospital.hospital_name}
                                    </p>
                                    <h6 className="text-gray-500 mb-2">Code</h6>
                                    <p className="mb-8">
                                        {hospital.hospital_code}
                                    </p>
                                    <h6 className="text-gray-500 mb-2">
                                        Location
                                    </h6>
                                    <p className=" mb-4">{hospital.location}</p>
                                </div>
                                <div className="w-1/2 md:w-1/3 xl:w-1/4 p-4">
                                    <h6 className="text-gray-500 mb-2">
                                        Latitude
                                    </h6>
                                    <p className="mb-8">{hospital.latitude}</p>
                                    <h6 className="text-gray-500 mb-2">
                                        Longitude
                                    </h6>
                                    <p className="mb-4">{hospital.longitude}</p>
                                </div>
                            </div>
                            <div className="mb-5">
                                <h6 className="text-gray-500 mb-4">
                                    Description
                                </h6>
                                <p className="mb-8">{hospital.description}</p>
                            </div>
                            <div className="mb-15">
                                <h6 className="text-gray-500 mb-4">
                                    General Details
                                </h6>
                                <p className="">{hospital.general_details}</p>
                            </div>
                            <TabContent hospitalId={hospital.id} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
