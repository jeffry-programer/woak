import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useServiceStore } from "@/store/useServiceStore";
import { useSubServiceStore } from "@/store/useSubServiceStore";
import { Dropdown } from 'primereact/dropdown';
import UploadButton from "../UploadButton";

export default function SubServiceForm({ hospitalId = null, id = null, cancelCallback }) {

    const { dataService, getDataService } = useServiceStore();
    const toast = useRef(null);
    const { createSubService, getOne, subService, updateSubService, isLoading, clearSubService } = useSubServiceStore();


    

    useEffect(()=>{
        getDataService(hospitalId);
    },[hospitalId])

    useEffect(()=>{
        if(id){
            getOne(id);
        }
    },[id])

    useEffect(()=>{
        if(subService){
            console.log(subService)
            setValue("sub_service_name", subService.sub_service_name);
            setValue("service_id", subService.service_id);
            setValue("status", subService.status);
        }
    },[subService])

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset
    } = useForm({
        defaultValues: {
            sub_service_name: "",
            service_id: "",
            status: false,
            sub_service_image: null,
        },
    }); 

    const onSubmit = async (data) => {
        const response = id ? await updateSubService(id, hospitalId, data) : await createSubService(hospitalId, data);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: id ? 'Sub Servicio actualizado exitosamente' : 'Sub Servicio creado exitosamente' });
            reset();
            clearSubService();
            new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
                cancelCallback()
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: id ? 'Error al actualizar el sub servicio' : 'Error al crear el sub servicio' });
        }
    };  

    return (
        <div className="max-w-auto mx-auto sm:px-8 lg:px-10">
            <Toast ref={toast}></Toast>
            {
                isLoading ?
                (
                    <div className="flex justify-center items-center h-[200px]">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
                    </div>
                )
                :
                (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">Crear Sub Servicio</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                                <Controller
                                    render={({ field }) => (
                                        <Dropdown 
                                            name="service_id" 
                                            options={dataService?.map((service) => ({ label: service.service_name, value: service.id }))} 
                                            optionLabel="label" 
                                            optionValue="value"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                    control={control}
                                    name="service_id"
                                />
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Nombre del Sub Servicio</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="sub_service_name" 
                                                type="text" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="sub_service_name"
                                        rules={{ required: true }}
                                    />
                                    {errors.sub_service_name && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>
                                {
                                    subService &&
                                    <Controller
                                        render={({ field }) => (
                                            <Dropdown 
                                                name="status" 
                                                options={[
                                                    { label: 'Activo', value: 1 },
                                                    { label: 'Inactivo', value: 0 },
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
                                }
                                <UploadButton 
                                    title="Imagen del Sub Servicio" 
                                    value={subService?.sub_service_image}
                                    callback={(file) => setValue("sub_service_image", file)}
                                />
                                <div className="flex flex-row items-center justify-end space-x-2">
                                    <div>
                                        <Button type="button" label="Cancelar" severity="danger" onClick={() => cancelCallback()} />
                                    </div>
                                    <div>
                                        <Button type="submit" label="Guardar" severity="success" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}