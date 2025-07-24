import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSupportStore } from "@/store/useSupportStore";
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';

export default function SupportForm({ hospitalId = null, id = null, cancelCallback }) {
    const toast = useRef(null);
    const { createSupport, getOne, support, updateSupport, isLoading, clearSupport } = useSupportStore();

    useEffect(()=>{
        if(id){
            getOne(id);
        }
    },[id])

    useEffect(()=>{
        if(support){
            setValue("hospital_data", support.hospital_data);
            setValue("subject", support.subject);
            setValue("problem", support.problem);
            setValue("phone_number", support.phone_number);
            setValue("status", support.status);
            setValue("hospital_id", hospitalId);
        }
    },[support])

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset
    } = useForm({
        defaultValues: {
            hospital_data: "",
            subject: "",
            problem: "",
            phone_number: "",
            status: "pending",
            hospital_id: hospitalId,
        },
    });     

    const onSubmit = async (data) => {
        const response = id ? await updateSupport(id, data) : await createSupport(data);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: id ? 'Ticket de soporte actualizado exitosamente' : 'Ticket de soporte creado exitosamente' });
            reset();
            clearSupport();
            new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
                cancelCallback()
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: id ? 'Error al actualizar el ticket de soporte' : 'Error al crear el ticket de soporte' });
        }
    }; 

    return(
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
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">Crear Ticket de Soporte</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Datos del Hospital</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="hospital_data" 
                                                type="text" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="hospital_data"
                                        rules={{ required: true }}
                                    />
                                    {errors.hospital_data && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Asunto</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="subject" 
                                                type="text" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="subject"
                                        rules={{ required: true }}
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>

                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Problema</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputTextarea
                                                name="problem" 
                                                type="text" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="problem"
                                        rules={{ required: true }}
                                    />
                                    {errors.problem && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>

                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Teléfono </label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputMask 
                                                mask="(999) 999-9999" 
                                                name="phone_number" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="phone_number"
                                        rules={{ required: false }}
                                    />
                                </div>

                                {
                                    support &&
                                    <Controller
                                        render={({ field }) => (
                                            <Dropdown 
                                                name="status" 
                                                options={[
                                                    { label: 'Pendiente', value: 'pending' },
                                                    { label: 'En Proceso', value: 'in_process' },
                                                    { label: 'Completado', value: 'completed' },
                                                    { label: 'Reasignado', value: 'reassessment' },
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