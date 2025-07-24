import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from 'primereact/button'; 

import { useHospitalStore } from '@/store/useHospitalStore';

export default function AddHospital() {
    const toast = useRef(null);
    const { createHospital, isLoading } = useHospitalStore();

    const defaultForm = {
        hospital_name: "",
        description: "",
        general_details: "",
        location: "",
        latitude: "0",
        longitude: "0",
        image: null,
        hospital_code: "",
    };

    const [form, setForm] = useState(defaultForm);
    const [fileToUpload, setFileToUpload] = useState(null);

    const onImageSelect = (e) => {
        if (e.files && e.files.length > 0) {
            setFileToUpload(e.files[0]);
        } else {
            setFileToUpload(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const validateForm = () => {

        if (!form.hospital_code.trim() || 
            !form.hospital_name.trim() || 
            !form.location.trim() || 
            !form.description.trim() || 
            !form.general_details.trim()) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.current.show({
                severity: "error",
                summary: "Validation Error",
                detail: "Please fill in all required fields.",
            });
            return;
        }

        const formDataToSend = new FormData();
        for (const key in form) {
            if (key !== 'image') {
                formDataToSend.append(key, form[key]);
            }
        }
        if (fileToUpload) {
            formDataToSend.append('image', fileToUpload);
        }

        try {
            const result = await createHospital(formDataToSend);

            if (result.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Hospital created successfully!",
                });
                setTimeout(() => {
                    window.location.href = "/hospital/list";
                }, 1000); 
                setForm(defaultForm);
                setFileToUpload(null);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Creation Failed",
                    detail: result.message || "Could not create hospital. Check console for more details.",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.current.show({
                severity: "error",
                summary: "Unknown Error",
                detail: "An unexpected error occurred while trying to create the hospital.",
            });
        }
    };

    return (
        <AdminLayout>
            <Toast ref={toast}></Toast>
            <Head title="Add Hospital" />
            <div className="py-8 px-15">
                <div className="max-w-auto mx-auto sm:px-8 lg:px-10">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">
                                Add Hospital
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="hospital_code" className="font-bold text-gray-600 mb-3">
                                        Hospital Code
                                    </label>
                                    <InputText
                                        id="hospital_code"
                                        name="hospital_code"
                                        type="text"
                                        className="w-full p-2 mb-12"
                                        onChange={handleChange}
                                        value={form.hospital_code} 
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="hospital_name" className="font-bold text-gray-600 mb-3">
                                        Hospital Name
                                    </label>
                                    <InputText
                                        id="hospital_name"
                                        name="hospital_name"
                                        type="text"
                                        className="w-full p-2 mb-12"
                                        onChange={handleChange}
                                        value={form.hospital_name}
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="location" className="font-bold text-gray-600 mb-3">
                                        Location
                                    </label>
                                    <InputText
                                        id="location"
                                        type="text"
                                        name="location"
                                        className="w-full p-2 mb-4"
                                        onChange={handleChange}
                                        value={form.location}
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="description" className="font-bold mb-3 text-gray-600">
                                        Description
                                    </label>
                                    <InputTextarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        className="w-full p-2 mb-4"
                                        onChange={handleChange}
                                        value={form.description}
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="general_details" className="font-bold text-gray-600 mb-3">
                                        General Details
                                    </label>
                                    <InputTextarea
                                        id="general_details"
                                        name="general_details"
                                        rows={5}
                                        className="w-full p-2 mb-4"
                                        onChange={handleChange}
                                        value={form.general_details}
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="image" className="font-bold text-gray-600 mb-3">
                                        Hospital Image
                                    </label>
                                    <FileUpload
                                        mode="basic"
                                        name="image" 
                                        url="/api/upload"
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        onSelect={onImageSelect} 
                                        auto={false} 
                                        chooseLabel="Choose Image"
                                    />
                                    {fileToUpload && <span className="text-sm mt-2">Selected file: {fileToUpload.name}</span>}
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        label="Cancel"
                                        icon="pi pi-times"
                                        onClick={() => window.history.back()}
                                        className="mr-5 p-button-secondary"
                                        style={{ marginRight: '.5em' }} 
                                    />
                                    <Button
                                        type="submit"
                                        label="Save"
                                        icon="pi pi-check"
                                        loading={isLoading} 
                                        className="p-button-primary"
                                        disabled={isLoading || !validateForm()} 
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}