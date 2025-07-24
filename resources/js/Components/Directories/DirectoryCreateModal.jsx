import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useDirectoryStore } from "@/store/useDirectoryStore";
import { useUnitStore } from "@/store/useUnitStore";
import axios from 'axios';

export default function DirectoryCreateModal({ visible, onHide, toastRef, hospital_id }) {
    const { createDirectoryEntry } = useDirectoryStore();
    const { getDataUnit, dataUnit } = useUnitStore();

    const [formData, setFormData] = useState({
        hospital_id: hospital_id,
        name: '',
        unit_id: null,
        phone_number: '',
        description: '',
    });

    const [loadingCreate, setLoadingCreate] = useState(false);

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
        if (visible) {
            setFormData({
                hospital_id: hospital_id,
                name: '',
                unit_id: null,
                phone_number: '',
                description: '',
            });
            
            getDataUnit();
        }
    }, [visible, getDataUnit, hospital_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDropdownChange = (name, e) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: e.value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.hospital_id || !formData.unit_id || !formData.phone_number) {
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Please complete all required fields.' });
            return;
        }

        setLoadingCreate(true);
        try {
            const success = await createDirectoryEntry(formData);
            if (success) {
                toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Directory entry created successfully de directorio creada correctamente.' });
                onHide();
            } else {
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Could not create directory entry.' });
            }
        } catch (error) {
            console.error("Error en handleSubmit al crear entrada de directorio:", error);
            toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while trying to create the directory entry.' });
        } finally {
            setLoadingCreate(false);
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
            <Button
                label="Guardar"
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={loadingCreate}
                disabled={!formData.name || !formData.unit_id || !formData.phone_number}
            />
        </div>
    );

    return (
        <Dialog
            header="Crear Entrada de Directorio"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={onHide}
            footer={dialogFooter}
            modal
        >
            <div className="p-fluid lg:px-20 md:px-6 pt-5">
                <div className="field col-12 mb-4">
                    <label htmlFor="name" className="block text-900 font-medium mb-2">Contact Name</label>
                    <InputText
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Contact Name"
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label htmlFor="unit_id" className="block text-900 font-medium mb-2">Unit to which it belongs</label>
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

                <div className="field col-12 mb-4">
                    <label htmlFor="phone_number" className="block text-900 font-medium mb-2">Phone number</label>
                    <InputText
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label htmlFor="description" className="block text-900 font-medium mb-2">Description(Opcional)</label>
                    <InputTextarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Additional information or notes"
                    />
                </div>
            </div>
        </Dialog>
    );
}