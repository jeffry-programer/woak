import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { router } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ListUser() {
    const { dataUser, 
        getDataUser, 
        deleteUser, 
        isLoading, 
        lazyState, 
        totalRecords,
        setLazyState
    } = useUserStore();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        getDataUser(globalFilterValue);
    }, [lazyState, globalFilterValue]);

    const onPage = (event) => {
        setLazyState(event);
    }
    
    useEffect(() => {
        getDataUser();
    }, []);



    const statusBodyTemplate = (rowData) => {
        return (
            rowData.status === 1 ? 
                <Badge value="Activo" severity="success"></Badge>
                :
                <Badge value="Inactivo" severity="danger"></Badge>
        )
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-row items-center">
                <Button icon="pi pi-pencil" className="p-button-text" onClick={() => router.visit(`/user/edit/${rowData.id}`)} />
                <Button icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
            </div>
        )
    };

    const handleDelete = async (id) => {
        const response = await deleteUser(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Usuario eliminado' });
            getDataUser();
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar usuario' });
        }
    };


    const confirmDelete = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Desea eliminar el usuario?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            defaultFocus: 'reject',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => handleDelete(rowData.id),
            reject: () => {
                console.log("Reject")
            }
        });
    };


    const renderHeader = () => {
        return (
            <div className="flex justify-content-end align-items-center">
                
                <span className="p-input-icon-left ml-auto">
                    <InputText
                        type="search"
                        value={globalFilterValue}
                        onChange={(e)=> setGlobalFilterValue(e.target.value)}
                        placeholder="Buscar Usuario"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <AdminLayout>
            <Toast ref={toast} />
            <div className="py-8 px-15">
                <div className="max-w-auto mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-row items-center justify-end my-2">
                                <Button 
                                    icon="pi pi-plus" 
                                    label="Agregar Usuario" 
                                    onClick={() => router.visit('/user/add')} 
                                />
                            </div>
                            <DataTable 
                                stripedRows
                                value={dataUser} 
                                lazy
                                paginator 
                                rows={lazyState.rows}
                                totalRecords={totalRecords}
                                first={lazyState.first}
                                onPage={onPage}
                                rowsPerPageOptions={[5, 10, 25, 50]} 
                                tableStyle={{ minWidth: '50rem' }} 
                                editor="true"
                                editMode="row" 
                                dataKey="id"
                                loading={isLoading}
                                header={header}
                                emptyMessage="No hay usuarios"
                            >
                                <Column field="name" header="Nombre" sortable></Column>
                                <Column field="email" header="Correo" sortable></Column>
                                <Column header="Estatus" body={statusBodyTemplate}></Column>
                                <Column header="Acciones" body={actionBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

                <ConfirmPopup
                    group="headless"
                />
            </div>
        </AdminLayout>
    );
}