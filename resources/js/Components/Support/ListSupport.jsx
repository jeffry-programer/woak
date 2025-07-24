import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import { useSupportStore } from "@/store/useSupportStore";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import SupportForm from "./SupportForm";

export default function ListSupport({hospitalId}) {
    const { dataSupport, 
        getDataSupport, 
        deleteSupport, 
        isLoading, 
        lazyState, 
        totalRecords,
        setLazyState,
        
    } = useSupportStore();

    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false)
    const [supportSelected, setSupportSelected] = useState(null)

    useEffect(() => {
        getDataSupport(hospitalId, globalFilterValue);
    }, [lazyState, globalFilterValue]);

    const onPage = (event) => {
        setLazyState(event);
    }

    useEffect(() => {
        getDataSupport(hospitalId);
    }, [hospitalId]);

    useEffect(() => {
        if (supportSelected) {
            setVisible(true);
        }
    }, [supportSelected]);

    const statusBodyTemplate = (rowData) => {

        switch (rowData.status) {
            case 'in_process':
                return <Badge value="En Proceso" severity="warning" className="w-[100px]"></Badge>;
            case 'completed':
                return <Badge value="Completado" severity="success" className="w-[100px]"></Badge>;
            case 'reassessment':
                return <Badge value="Reasignado" severity="danger" className="w-[100px]"></Badge>;
            default:
                return <Badge value="Pediente" severity="primary" className="w-[100px]"></Badge>;
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-row items-center">
                <Button icon="pi pi-pencil" className="p-button-text" onClick={() => {
                    setSupportSelected(rowData);
                }} />
                <Button icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
            </div>
        )
    };

    const handleDelete = async (id) => {
        const response = await deleteSupport(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Ticket de Soporte eliminado' });
            getDataSupport(hospitalId);
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar ticket de soporte' });
        }
    };

    const confirmDelete = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Desea eliminar el ticket de soporte?',
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
                        placeholder="Buscar Ticket de Soporte"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
            <Toast ref={toast} />
            <div className="max-w-auto mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex flex-row items-center justify-end my-2">
                            <Button 
                                icon="pi pi-plus" 
                                label="Crear Ticket de Soporte" 
                                onClick={() => setVisible(true)} 
                            />
                        </div>
                        <DataTable 
                            stripedRows
                            value={dataSupport} 
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
                            emptyMessage="No hay tickets de soporte"
                        >
                            <Column field="hospital_data" header="Datos del Hospital"></Column>
                            <Column field="subject" header="Asunto" sortable></Column>
                            <Column field="problem" header="Problema" sortable></Column>
                            <Column field="phone_number" header="Telefono"></Column>
                            <Column header="Estatus" body={statusBodyTemplate}></Column>
                            <Column header="Acciones" body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <ConfirmPopup
                group="headless"
            />

            <Dialog header="Ticket de Soporte" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <SupportForm
                    hospitalId={hospitalId}
                    id={supportSelected?.id || null}
                    cancelCallback={() => {
                        setVisible(false);
                        setSupportSelected(null);
                    }}
                />
            </Dialog>
        </>
    )
}