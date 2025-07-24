import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import { useHospitalUserStore } from "@/store/useHospitalUserStore";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import UserEditModal from './HospitalUserEditModal';
import UserCreateModal from './HospitalUserCreateModal';

export default function HospitalUserList({hospital_id}) {
  const { dataUser, 
    getDataHospitalUser,
    deleteHospitalUser, 
    isLoading, 
    lazyState, 
    totalRecords,
    setLazyState,
    getOneHospitalUser
  } = useHospitalUserStore();
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getDataHospitalUser({
      hospital_id: hospital_id,
      user_name: globalFilterValue,
      page: lazyState.page,
      rows: lazyState.rows,
      first: lazyState.first,
    });
  }, [
    hospital_id, 
    globalFilterValue,
    lazyState.page,
    lazyState.rows,
    getDataHospitalUser
  ]);

  const onPage = (event) => {
    setLazyState(event);
  };


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
      <div className="flex flex-row items-center justify-center">
        <Button icon="pi pi-pencil" className="p-button-text" onClick={() => openEditModal(rowData)} />
        <Button icon="pi pi-trash" className="p-button-text" onClick={(event) => confirmDelete(event, rowData)} />
      </div>
    )
  };
  const openCreateModal = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    getDataHospitalUser({
        hospital_id: hospital_id,
        user_name: globalFilterValue,
        page: lazyState.page,
        rows: lazyState.rows,
        first: lazyState.first,
    });
  };


  const openEditModal = async (rowData) => {
    const userToEdit = await getOneHospitalUser(rowData.id); 
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setShowEditModal(true);
    } else {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error to get user' });
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    getDataHospitalUser({
        hospital_id: hospital_id,
        user_name: globalFilterValue,
        page: lazyState.page,
        rows: lazyState.rows,
        first: lazyState.first,
    });
  };

  const handleDelete = async (id) => {
    const response = await deleteHospitalUser(id);
    if (response) {
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Delete User' });
      getDataHospitalUser({
          hospital_id: hospital_id,
          user_name: globalFilterValue,
          page: lazyState.page,
          rows: lazyState.rows,
          first: lazyState.first,
      });
    }else{
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error to delete user' });
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
    <>
      <Toast ref={toast} />
      <div className="flex flex-row items-center justify-end mb-3">
        <Button 
          icon="pi pi-plus" 
          label="Add User" 
          onClick={() => openCreateModal()} 
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
        emptyMessage="Dont have users"
      >
        <Column field="user_id" header="ID" sortable></Column>
        <Column field="user.name" header="Name" sortable></Column>
        <Column field="user.email" header="Email/User name" sortable></Column>
        <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
        <Column field="type_user" header="Type User" sortable></Column>
        <Column header="Actions" body={actionBodyTemplate} align="center" ></Column>
      </DataTable>
      <ConfirmPopup group="headless" />
      {showEditModal && ( 
        <UserEditModal
          visible={showEditModal}
          onHide={closeEditModal}
          userData={selectedUser}
          toastRef={toast} 
        />
      )}
      {showCreateModal && (
        <UserCreateModal 
          visible={showCreateModal}
          onHide={closeCreateModal}
          hospital_id={hospital_id}
          toastRef={toast}
        />
      )}
    </>
  )
}