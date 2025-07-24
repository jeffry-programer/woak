import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRef, useEffect } from "react";
import { router } from '@inertiajs/react';
import { useForm, Controller } from "react-hook-form";
import { useUserStore } from "@/store/useUserStore";
import { Dropdown } from 'primereact/dropdown';

export default function AddUser({ id = null }) {
    const toast = useRef(null);
    const { createUser, getOne, user, updateUser } = useUserStore();
    

    useEffect(()=>{
        if(id){
            getOne(id);
        }
    },[id])

    useEffect(()=>{
        if(user){
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("status", user.status == 1);
        }
    },[user])

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            status: false,
            password: "",
        },
    }); 


    const onSubmit = async (data) => {
        const response = id ? await updateUser(id, data) : await createUser(data);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: id ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente' });
            router.visit('/user/list');
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: id ? 'Error al actualizar el usuario' : 'Error al crear el usuario' });
        }
    };    

    return (
        <AdminLayout>
            <Toast ref={toast}></Toast>
            <Head title="Agregar Usuario" />
            <div className="py-8 px-15">
                <div className="max-w-auto mx-auto sm:px-8 lg:px-10">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">Crear Usuario</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Nombre</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="name" 
                                                type="text" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="name"
                                        rules={{ required: true }}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Email</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="email" 
                                                type="email" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="email"
                                        rules={{ required: true }}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label className="font-bold text-gray-600 mb-3">Password</label>
                                    <Controller
                                        render={({ field }) => (
                                            <InputText 
                                                name="password" 
                                                type="password" 
                                                className="w-full p-2 mb-12" 
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                        control={control}
                                        name="password"
                                        rules={{ required: !user ? true : false }}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-2">Campo requerido</p>
                                    )}
                                </div>
                                {
                                    user &&
                                    <Controller
                                        render={({ field }) => (
                                            <Dropdown 
                                                name="status" 
                                                options={[
                                                    { label: 'Activo', value: true },
                                                    { label: 'Inactivo', value: false },
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
                                        <Button type="button" label="Cancelar" severity="danger" onClick={() => window.history.back()} />
                                    </div>
                                    <div>
                                        <Button type="submit" label="Guardar" severity="success" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
    
}