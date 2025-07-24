import { useHospitalStore } from "@/store/useHospitalStore";
import { useState, useEffect, useRef } from "react";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const HospitalTrashed = () => {

    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const { hospitals, 
            getTrashHospitals, 
            forceDeleteHospital, 
            restoreHospital, 
            isLoading, 
            lazyState, 
            totalRecords,
            setLazyState,
        } = useHospitalStore();

    useEffect(() => {
        getTrashHospitals(globalFilterValue);
    }, [lazyState, globalFilterValue]);

    const onPage = (event) => {
        setLazyState(event);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-row items-center">
                <Button title="Restaurar" icon="pi pi-refresh" className="p-button-text" onClick={(event) => confirmRestore(event, rowData)} />
                <Button title="Eliminar" icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
            </div>
        )
    };

    const handleDelete = async (id) => {
        const response = await forceDeleteHospital(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Hospital eliminado' });
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar hospital' });
        }
        getTrashHospitals(globalFilterValue);
    };

    const handleRestore = async (id) => {
        const response = await restoreHospital(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Hospital restaurado' });
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al restaurar hospital' });
        }
        getTrashHospitals(globalFilterValue);
    };

    const confirmRestore = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Desea restaurar el hospital?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-success',
            defaultFocus: 'reject',
            acceptLabel: 'Restaurar',
            rejectLabel: 'Cancelar',
            accept: () => handleRestore(rowData.id),
            reject: () => {
                console.log("Reject")
            }
        });
    };

    const confirmDelete = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Desea eliminar definitivamente el hospital?',
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
                        placeholder="Buscar Hospital"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
            <>
                <Toast ref={toast} />
                <DataTable 
                    stripedRows
                    value={hospitals} 
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
                    emptyMessage="No hay unidades"
                >
                    <Column field="hospital_name" header="Nombre" sortable></Column>
                    <Column field="hospital_code" header="Codigo" sortable></Column>
                    <Column field="location" header="Ubicacion" sortable></Column>
                    <Column field="description" header="Descripcion" sortable></Column>
                    <Column header="Acciones" body={actionBodyTemplate}></Column>
                </DataTable>

                <ConfirmPopup
                    group="headless"
                />
            </>
        );

};  

export default HospitalTrashed;
