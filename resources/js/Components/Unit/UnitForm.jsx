import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useUnitStore } from "@/store/useUnitStore";
import { Dropdown } from 'primereact/dropdown';
import UploadButton from "../UploadButton";

export default function UnitForm({ hospitalId = null, id = null, cancelCallback }) {
    const toast = useRef(null);
    const { createUnit, getOne, unit, updateUnit, isLoading, clearUnit } = useUnitStore();
    
    
    useEffect(()=>{
        if(id){
            getOne(id);
        }
    },[id])

    useEffect(()=>{
        if(unit){
            setValue("unit_name", unit.unit_name);
            setValue("hospital_id", hospitalId);
            setValue("status", unit.status);
        }
    },[unit])

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset
    } = useForm({
        defaultValues: {
            unit_name: "",
            hospital_id: hospitalId,
            status: false,
            unit_image: null,
        },
    }); 


    const onSubmit = async (data) => {
        const response = id ? await updateUnit(id, data) : await createUnit(data);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: id ? 'Unidad actualizada exitosamente' : 'Unidad creada exitosamente' });
            reset();
            clearUnit();
            new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
                cancelCallback()
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: id ? 'Error al actualizar la unidad' : 'Error al crear la unidad' });
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
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">Crear Unidad</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Nombre de la Unidad</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="unit_name" 
                                                type="text" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="unit_name"
                                        rules={{ required: true }}
                                    />
                                    {errors.unit_name && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>
                                {
                                    unit &&
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
                                    title="Imagen de la Unidad" 
                                    value={unit?.unit_image}
                                    callback={(file) => setValue("unit_image", file)}
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
    );
    
}