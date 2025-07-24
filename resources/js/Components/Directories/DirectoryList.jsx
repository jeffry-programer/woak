import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import DirectoryEditModal from './DirectoryEditModal';
import DirectoryCreateModal from './DirectoryCreateModal';

export default function DirectoryList({hospital_id}) {
    const { 
        dataDirectory,
        getDirectoryData,
        deleteDirectoryEntry,
        isLoading, 
        lazyState, 
        totalRecords,
        setLazyState,
        getOneDirectoryEntry
    } = useDirectoryStore();

    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
    getDirectoryData({
        hospital_id: hospital_id,
        search_term: globalFilterValue,
        page: lazyState.page,
        rows: lazyState.rows,
        first: lazyState.first,
    });
    }, [
        hospital_id, 
        globalFilterValue, 
        lazyState.page, 
        lazyState.rows,  
        getDirectoryData 
    ]);

    const onPage = (event) => {
        setLazyState(event);
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-row items-center justify-center">
                <Button icon="pi pi-pencil" className="p-button-text" onClick={() => openEditModal(rowData)} />
                <Button icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
            </div>
        );
    };

    const openCreateModal = () => {
        setSelectedEntry(null);
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        getDirectoryData({
            hospital_id: hospital_id,
            search_term: globalFilterValue,
            page: lazyState.page,
            rows: lazyState.rows,
            first: lazyState.first,
        });
    };

    const openEditModal = async (rowData) => {
        const entryToEdit = await getOneDirectoryEntry(rowData.id);
        if (entryToEdit) {
            setSelectedEntry(entryToEdit);
            setShowEditModal(true);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error getting directory entry' });
        }
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedEntry(null);
        getDirectoryData({
            hospital_id: hospital_id,
            search_term: globalFilterValue,
            page: lazyState.page,
            rows: lazyState.rows,
            first: lazyState.first,
        });
    };

    const handleDelete = async (id) => {
        const response = await deleteDirectoryEntry(id);
        if (response) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Directory entry removed' });
            getDirectoryData({
                hospital_id: hospital_id,
                search_term: globalFilterValue,
                page: lazyState.page,
                rows: lazyState.rows,
                first: lazyState.first,
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error deleting directory entry' });
        }
    };

    const confirmDelete = (event, rowData) => {
        confirmPopup({
            group: 'headless',
            target: event.currentTarget,
            message: '¿You want to delete this entry from the directory ?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            defaultFocus: 'reject',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: () => handleDelete(rowData.id),
            reject: () => {
                console.log("Rechazado")
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
                        placeholder="Search in directory"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
            <Toast ref={toast} />
            <div className="flex flex-row items-center justify-end mb-3">
                <Button 
                    icon="pi pi-plus" 
                    label="Add Directory"
                    onClick={() => openCreateModal()} 
                />
            </div>
            <DataTable 
                stripedRows
                value={dataDirectory}
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
                emptyMessage="There are no entries in the directory."
            >
                <Column field="name" header="Name" sortable></Column>
                <Column field="unit.unit_name" header="Unit" sortable></Column>
                <Column field="created_by.name" header="Created By" sortable></Column>
                <Column field="edited_by.name" header="Last Edited by" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column header="Actions" body={actionBodyTemplate} align="center" ></Column>
            </DataTable>
            <ConfirmPopup group="headless" />
            {showEditModal && ( 
                <DirectoryEditModal
                    visible={showEditModal}
                    onHide={closeEditModal}
                    directoryData={selectedEntry}
                    hospital_id={hospital_id}
                    toastRef={toast} 
                />
            )}
            {showCreateModal && (
                <DirectoryCreateModal
                    visible={showCreateModal}
                    onHide={closeCreateModal}
                    hospital_id={hospital_id}
                    toastRef={toast}
                />
            )}
        </>
    );
};