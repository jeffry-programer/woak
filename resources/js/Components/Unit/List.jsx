import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import { useUnitStore } from "@/store/useUnitStore";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import UnitForm from "./UnitForm";

export default function ListUnit({hospitalId}) {
    const { dataUnit, 
        getDataUnit, 
        deleteUnit, 
        isLoading, 
        lazyState, 
        totalRecords,
        setLazyState,
        
    } = useUnitStore();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visible, setVisible] = useState(false)
    const [unitSelected, setUnitSelected] = useState(null)

    useEffect(() => {
        getDataUnit(hospitalId, globalFilterValue);
    }, [lazyState, globalFilterValue]);

    const onPage = (event) => {
        setLazyState(event);
    }
    
    useEffect(() => {
        getDataUnit(hospitalId);
    }, [hospitalId]);

    useEffect(() => {
        if (unitSelected) {
            setVisible(true);
        }
    }, [unitSelected]);

    const imageBodyTemplate = (rowData) => {
        return (
            <img 
                src={rowData.unit_image ? rowData.unit_image : '/images/no-image.jpg'} 
                alt={rowData.unit_name} 
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
            <div className="flex flex-row items-center">
                <Button icon="pi pi-pencil" className="p-button-text" onClick={() => {
                    setUnitSelected(rowData);
                }} />
                <Button icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
            </div>
        )
    };

    const handleDelete = async (id) => {
        const response = await deleteUnit(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Unidad eliminada' });
            getDataUnit(hospitalId);
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar unidad' });
        }
    };


    const confirmDelete = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: 'Desea eliminar la unidad?',
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
                        placeholder="Buscar Unidad"
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
                                label="Agregar Unidad" 
                                onClick={() => setVisible(true)} 
                            />
                        </div>
                        <DataTable 
                            stripedRows
                            value={dataUnit} 
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
                            <Column field="unit_image" header="Imagen" body={imageBodyTemplate}></Column>
                            <Column field="unit_name" header="Nombre" sortable></Column>
                            <Column header="Estatus" body={statusBodyTemplate}></Column>
                            <Column header="Acciones" body={actionBodyTemplate}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            <ConfirmPopup
                group="headless"
            />

            <Dialog header="Unidad de Hospital" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <UnitForm
                    hospitalId={hospitalId}
                    id={unitSelected?.id || null}
                    cancelCallback={() => {
                        setVisible(false);
                        setUnitSelected(null);
                    }}
                />
            </Dialog>
            
        </>
    );
}