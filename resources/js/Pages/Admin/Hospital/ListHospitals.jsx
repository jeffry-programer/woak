import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef, Fragment } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Badge } from "primereact/badge";

import { useHospitalStore } from '@/store/useHospitalStore';

export default function ListHospitals() {
    const { 
        hospitals, 
        getAllHospitals, 
        deleteHospital, 
        isLoading, 
        lazyState, 
        totalRecords, 
        setLazyState 
    } = useHospitalStore();

    const toast = useRef(null);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [hospitalToDelete, setHospitalToDelete] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState(''); // Estado local para el filtro

    // Este useEffect se encargará de cargar los datos cuando cambie la paginación o el filtro
    useEffect(() => {
        // Llama a getAllHospitals, pasándole el valor del filtro directamente
        getAllHospitals(globalFilterValue); 
        // No necesitas pasar lazyState aquí, ya que getAllHospitals lo obtiene de get().lazyState
    }, [lazyState.page, lazyState.rows, lazyState.first, globalFilterValue, getAllHospitals]);
    // Asegúrate de que lazyState.first, page y rows sean dependencias si los cambias para resetear el paginador al filtrar.

    const onPage = (event) => {
        // Cuando cambia la paginación, simplemente actualiza el lazyState del store
        setLazyState(event);
    };

    const confirmDelete = (hospital) => {
        setHospitalToDelete(hospital);
        setDeleteDialog(true);
    };

    const handleDeleteHospital = async () => {
        if (hospitalToDelete) {
            const success = await deleteHospital(hospitalToDelete.id);
            if (success) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Hospital deleted successfully.' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not delete hospital.' });
            }
            setDeleteDialog(false);
            setHospitalToDelete(null);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Fragment>
                <Button type="button" icon="pi pi-eye" onClick={() => router.visit(`/hospital/details/${rowData.id}`)} rounded outlined style={{ marginRight: '.5em' }} />
                <Button type="button" icon="pi pi-pencil" onClick={() => router.visit(`/hospital/edit/${rowData.id}`)} rounded outlined style={{ marginRight: '.5em' }} />
                <Button icon="pi pi-trash" className="p-button-danger" rounded outlined severity="danger" onClick={() => confirmDelete(rowData)} />
            </Fragment>
        );
    };

    const deleteDialogFooter = (
        <div>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-danger" onClick={handleDeleteHospital} />
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        return (
            rowData.status === true ? 
              <Badge value="Active" severity="success"></Badge>
              :
              <Badge value="Inactive" severity="danger"></Badge>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <Button 
                    label="Add Hospital" 
                    icon="pi pi-plus" 
                    onClick={() => router.visit('/hospital/add')} 
                    className="p-button-primary"
                />
                <span className="p-input-icon-left ml-auto">
                    <InputText
                        type="search"
                        value={globalFilterValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setGlobalFilterValue(value); // Actualiza el estado local del filtro

                            // Si el filtro cambia, reseteamos la paginación al principio
                            // para que la búsqueda se haga desde la primera página.
                            setLazyState({
                                ...lazyState, // Mantiene rows
                                first: 0,
                                page: 0,
                            });
                        }}
                        placeholder="Search by Name..." 
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <AdminLayout>
            <Toast ref={toast}></Toast>
            <Head title="Hospital List" />
            <div className="py-8 px-15">
                <div className="max-w-auto mx-auto sm:px-4 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 bg-white">
                            <h2 className="text-3xl text-gray-400 mt-3 mb-5">Hospital List</h2>
                            <DataTable 
                                value={hospitals} 
                                lazy 
                                paginator 
                                rows={lazyState.rows} 
                                totalRecords={totalRecords} 
                                first={lazyState.first} 
                                onPage={onPage} 
                                rowsPerPageOptions={[5, 10, 25, 50]} 
                                tableStyle={{ minWidth: '50rem' }} 
                                dataKey="id"
                                loading={isLoading} 
                                header={header} 
                                emptyMessage="No hospitals found." 
                            >
                                <Column field="hospital_name" header="Name" sortable></Column>
                                <Column field="hospital_code" header="Code" sortable></Column>
                                <Column field="location" header="Location" sortable></Column>
                                <Column field="description" header="Description" sortable></Column>
                                <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
                                <Column align={'center'} body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} header="Actions"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog 
                visible={deleteDialog} 
                style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Confirm Deletion" 
                modal 
                footer={deleteDialogFooter} 
                onHide={() => setDeleteDialog(false)}
            >
                <div className="confirmation-content flex items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {hospitalToDelete && (
                        <span>
                            Are you sure you want to delete <b>{hospitalToDelete.hospital_name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </AdminLayout>
    );
}   