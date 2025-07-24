import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { useHospitalUserStore } from "@/store/useHospitalUserStore";
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { useUnitStore } from "@/store/useUnitStore";


export default function UserEditModal({ visible, onHide, userData, toastRef, hospital_id, }) {
    const { updateHospitalUser } = useHospitalUserStore();
    const { getDataUnit, dataUnit } = useUnitStore();

    
    const [formData, setFormData] = useState(userData || {});
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [professionsList, setProfessionsList] = useState([]);

    const formattedUnits = useMemo(() => {
        if (dataUnit && dataUnit.length > 0) {
            return dataUnit.map(unit => ({
                label: unit.unit_name,
                value: unit.id
            }));
        }
        return [];
    }, [dataUnit]);

   
    useEffect(() => {
        if (userData) {
            
            setFormData({
                id: userData.id,
                hospital_id: userData.hospital_id || null,
                user_id: userData.user_id || null,
                type_user: userData.type_user || '',
                profession_id: userData.profession_id || null, 
                unit_id: userData.unit_id || null,
                status: !!userData.status, 
                name: userData.user?.name || '', 
                email: userData.user?.email || '', 
            });
        }
        getDataUnit();
    }, [userData, getDataUnit]);

    useEffect(() => {
        if (visible) {
            const fetchProfessions = async () => {
                try {
                   
                    const professionsRes = await axios.get('/act/profession');
                    
                    setProfessionsList(professionsRes.data.map(prof => ({ label: prof.title, value: prof.id })));
                } catch (error) {
                    console.error("Error al cargar profesiones:", error);
                    toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar profesiones.' });
                }
            };
            fetchProfessions();
        }
    }, [visible, toastRef]); 

    
    const handleDropdownChange = (name, e) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: e.value,
        }));
    };

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

   
    const handleSwitchChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            status: e.value,
        }));
    };

    
    const handleSubmit = async () => {
        if (!formData.id) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'User ID is required.' });
            return;
        }

        setLoadingUpdate(true);
        try {
           
            const success = await updateHospitalUser(formData.id, formData);
            if (success) {
                toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'User updated successfully.' });
                onHide(); 
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update the user.' });
            }
        } catch (error) {
            console.error("Error al enviar la actualización:", error);
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Fallo al actualizar el usuario.' });
        } finally {
            setLoadingUpdate(false);
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} loading={loadingUpdate} />
        </div>
    );

    return (
        <Dialog
            header="Actualizar Usuario de Hospital"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            footer={dialogFooter}
            modal
        >
            <div className="p-fluid lg:px-20 md:px-6 pt-5">

                <div className="field col-12 mb-4">
                    <label htmlFor="user_name" className="block text-900 font-medium mb-2">Nombre</label>
                    <InputText id="user_name" name='name' value={formData.name} onChange={handleInputChange} />
                </div>

                <div className="field col-12 mb-4">
                    <label htmlFor="user_email" className="block text-900 font-medium mb-2">Email / Username</label>
                    <InputText id="user_email" name='email' value={formData.email} onChange={handleInputChange} />
                </div>

                {/* Type User */}
                <div className="field col-12 mb-4">
                    <label htmlFor="type_user" className="block text-900 font-medium mb-2">User Type</label>
                    <Dropdown
                        id="type_user"
                        name="type_user"
                        value={formData.type_user}
                        options={[
                            { label: 'Owner', value: 'owner' }, 
                            { label: 'Worker', value: 'worker' }, 
                        ]}
                        onChange={(e) => handleDropdownChange('type_user', e)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar tipo"
                        className="w-full"
                    />
                </div>

                
                <div className="field col-12 mb-4">
                    <label htmlFor="profession_id" className="block text-900 font-medium mb-2">ProFession</label>
                    <Dropdown
                        id="profession_id" 
                        name="profession_id" 
                        value={formData.profession_id}
                        options={professionsList}
                        onChange={(e) => handleDropdownChange('profession_id', e)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar una profesión"
                        className="w-full"
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label htmlFor="unit_id" className="block text-900 font-medium mb-2">Unit</label>
                    <Dropdown
                        id="unit_id"
                        name="unit_id"
                        value={formData.unit_id}
                        options={formattedUnits}
                        onChange={(e) => handleDropdownChange('unit_id', e)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Unit"
                        className="w-full"
                    />
                </div>

                {/* Status */}
                <div className="field col-12 mb-4 flex align-items-center">
                    <label htmlFor="status" className="block text-900 font-medium mr-3">Status</label>
                    <InputSwitch
                        id="status"
                        name="status"
                        checked={formData.status ?? false}
                        onChange={handleSwitchChange}
                    />
                </div>
            </div>
        </Dialog>
    );
}