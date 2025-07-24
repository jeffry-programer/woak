import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useServiceStore } from "@/store/useServiceStore";
import { Dropdown } from "primereact/dropdown";
import UploadButton from "../UploadButton";

export default function ServiceForm({
    hospitalId = null,
    id = null,
    cancelCallback,
}) {
    const toast = useRef(null);
    const {
        createService,
        getOne,
        service,
        updateService,
        isLoading,
        clearService,
    } = useServiceStore();

    useEffect(() => {
        if (id) {
            getOne(id);
        }
    }, [id]);

    useEffect(() => {
        if (service) {
            setValue("service_name", service.service_name);
            setValue("hospital_id", hospitalId);
            setValue("status", service.status);
        }
    }, [service]);

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            service_name: "",
            hospital_id: hospitalId,
            status: false,
            service_image: null,
        },
    });

    const onSubmit = async (data) => {
        const response = id
            ? await updateService(id, data)
            : await createService(data, hospitalId);
        if (response) {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: id
                    ? "Servicio actualizado exitosamente"
                    : "Servicio creado exitosamente",
            });
            reset();
            clearService();
            new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
                cancelCallback();
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: id
                    ? "Error al actualizar el servicio"
                    : "Error al crear el servicio",
            });
        }
    };

    return (
        <div className="max-w-auto mx-auto sm:px-8 lg:px-10">
            <Toast ref={toast}></Toast>
            {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: "2rem" }}
                    />
                </div>
            ) : (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-3xl text-gray-400 mt-3 mb-5">
                            Crear Servicio
                        </h2>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col space-y-4"
                        >
                            <div className="flex flex-col mb-5">
                                <label className="font-bold text-gray-600 mb-3">
                                    Nombre del Servicio
                                </label>
                                <Controller
                                    render={({ field }) => (
                                        <InputText
                                            name="service_name"
                                            type="text"
                                            className="w-full p-2 mb-12"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                    control={control}
                                    name="service_name"
                                    rules={{ required: true }}
                                />
                                {errors.service_name && (
                                    <p className="text-red-500 text-sm mt-2">
                                        Campo requerido
                                    </p>
                                )}
                            </div>
                            {service && (
                                <Controller
                                    render={({ field }) => (
                                        <Dropdown
                                            name="status"
                                            options={[
                                                { label: "Activo", value: 1 },
                                                { label: "Inactivo", value: 0 },
                                            ]}
                                            optionLabel="label"
                                            optionValue="value"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                    control={control}
                                    name="status"
                                />
                            )}
                            <UploadButton
                                title="Imagen del Servicio"
                                value={service?.service_image}
                                callback={(file) =>
                                    setValue("service_image", file)
                                }
                            />
                            <div className="flex flex-row items-center justify-end space-x-2">
                                <div>
                                    <Button
                                        type="button"
                                        label="Cancelar"
                                        severity="danger"
                                        onClick={() => cancelCallback()}
                                    />
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        label="Guardar"
                                        severity="success"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
