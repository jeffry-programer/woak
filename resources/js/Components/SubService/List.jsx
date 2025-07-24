import { Head } from "@inertiajs/react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import { useSubServiceStore } from "@/store/useSubServiceStore";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import SubServiceForm from "./SubServiceForm";


export default function ListSubService({hospitalId}) {
    
    const { dataSubService, 
        getDataSubService, 
        deleteSubService, 
        isLoading, 
        lazyState, 
        totalRecords,
        setLazyState
    } = useSubServiceStore();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');  
    const [visible, setVisible] = useState(false)
    const [subServiceSelected, setSubServiceSelected] = useState(null)

    useEffect(() => {
        getDataSubService(hospitalId, globalFilterValue);
    }, [lazyState, globalFilterValue]);

    const onPage = (event) => {
        setLazyState(event);
    }
    
    useEffect(() => {
        getDataSubService(hospitalId);
    }, [hospitalId]);   

    useEffect(() => {
        if (subServiceSelected) {
            setVisible(true);
        }
    }, [subServiceSelected]);

    const imageBodyTemplate = (rowData) => {
        return (
            <img 
                src={rowData.sub_service_image ? rowData.sub_service_image : '/images/no-image.jpg'} 
                alt={rowData.sub_service_name} 
                className="w-[50px] h-[50px] object-contain rounded-md" 
            />
        )
    }   

    const statusBodyTemplate = (rowData) => {
        return (
            rowData.status === 1 ? 
                <Badge value="Activo" severity="success" className="w-[80px]"></Badge>
                :
                <Badge value="Inactivo" severity="danger" className="w-[80px]"></Badge>
        )
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-row items-center w-full">
                <Button icon="pi pi-pencil" className="p-button-text" onClick={() => {
                    setSubServiceSelected(rowData);
                }} />
                <Button icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
            </div>
        )
    };
    
    const handleDelete = async (id) => {
        const response = await deleteSubService(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'SubServicio eliminado' });
            getDataSubService(hospitalId);
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar subServicio' });
        }
    };

    const confirmDelete = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Desea eliminar el sub-servicio?',
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
                        placeholder="Buscar sub-servicio"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
            <Head title="Listado de Servicios" />
            <Toast ref={toast} />
            
            <div className="max-w-auto mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex flex-row items-center justify-end py-2">
                            <Button 
                                icon="pi pi-plus" 
                                label="Agregar Sub Servicio" 
                                onClick={() => setVisible(true)} 
                            />
                        </div>
                        <DataTable 
                            stripedRows
                            value={dataSubService} 
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
                            emptyMessage="No hay servicios"
                        >
                            <Column field="sub_service_image" header="Imagen" body={imageBodyTemplate}></Column>
                            <Column field="sub_service_name" header="Nombre" sortable></Column>
                            <Column header="Estatus" body={statusBodyTemplate}></Column>
                            <Column header="Acciones" body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            <ConfirmPopup
                group="headless"
            />

            <Dialog header="Sub Servicio de Hospital" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <SubServiceForm 
                    hospitalId={hospitalId} 
                    id={subServiceSelected?.id} 
                    cancelCallback={() => {
                        setVisible(false);
                        setSubServiceSelected(null);
                    }} 
                />
            </Dialog>
        </>
    );


}