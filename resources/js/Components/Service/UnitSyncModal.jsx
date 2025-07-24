import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { useUnitStore } from "@/store/useUnitStore";
import { useServiceStore } from "../../store/useServiceStore";

export default function UnitSyncModal({
    visible,
    setVisible,
    service,
    onSync,
}) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [serviceUnits, setServiceUnits] = useState([]);
    const { dataUnit, getDataUnit } = useUnitStore();
    const { syncServiceUnits, getOne, dataUnits } = useServiceStore();
    const toast = useRef(null);

    // Fetch available units from the hospital
    useEffect(() => {
        if (visible && service) {
            fetchUnits();
            fetchServiceUnits();
        }
    }, [visible, service]);

    // Reset selected units when modal is closed
    useEffect(() => {
        if (!visible) {
            setSelectedUnits([]);
        }
    }, [visible]);

    const fetchUnits = async () => {
        if (!service?.hospital_id) return;

        setLoading(true);
        try {
            // fetch units from the hospital
            await getDataUnit(service.hospital_id);
            if (dataUnit && Array.isArray(dataUnit)) {
                setUnits(dataUnit);
            }
        } catch (error) {
            console.error("Error fetching units:", error);
            if (toast.current)
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "No se pudieron cargar las unidades",
                });
        } finally {
            setLoading(false);
        }
    };

    const fetchServiceUnits = async () => {
        if (!service?.id) return;

        setLoading(true);
        try {
            const response = await axios.get(`/act/service/${service.id}`, {
                params: {},
            });
            const data = await response.data;
            if (data.units && Array.isArray(data.units)) {
                setServiceUnits(data.units);
                setSelectedUnits(data.units.map((unit) => unit.id));
            }
        } catch (error) {
            console.error("Error fetching service units:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!service?.id) return;

        setLoading(true);
        try {
            const response = await syncServiceUnits(service.id, selectedUnits);
            console.log(response);
            if (response) {
                if (toast.current)
                    toast.current.show({
                        severity: "success",
                        summary: "Éxito",
                        detail: "Unidades sincronizadas correctamente",
                    });

                if (onSync) onSync();
                setVisible(false);
            }
        } catch (error) {
            console.error("Error syncing units:", error);
            if (toast.current)
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "No se pudieron sincronizar las unidades",
                });
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text"
            />
            <Button
                label="Sincronizar"
                icon="pi pi-check"
                onClick={handleSync}
                loading={loading}
                autoFocus
            />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header={`Sincronizar Unidades - ${service?.service_name || ""}`}
                visible={visible}
                style={{ width: "60vw" }}
                footer={footer}
                onHide={() => setVisible(false)}
            >
                <div className="card">
                    <p className="mb-4">
                        Seleccione las unidades que desea sincronizar con este
                        servicio.
                    </p>

                    <div className="field mb-4">
                        <label htmlFor="units" className="font-bold block mb-2">
                            Unidades
                        </label>
                        <MultiSelect
                            id="units"
                            value={selectedUnits}
                            options={dataUnit}
                            onChange={(e) => setSelectedUnits(e.value)}
                            optionLabel="unit_name"
                            optionValue="id"
                            placeholder="Seleccione las unidades"
                            filter
                            filterPlaceholder="Buscar unidad"
                            display="chip"
                            className="w-full"
                            loading={loading}
                        />
                    </div>

                    <div className="card">
                        <h3>Unidades Seleccionadas</h3>
                        <DataTable
                            value={units.filter((unit) =>
                                selectedUnits.includes(unit.id)
                            )}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            emptyMessage="No hay unidades seleccionadas"
                            loading={loading}
                        >
                            <Column
                                field="unit_name"
                                header="Nombre"
                                sortable
                            />
                            <Column
                                field="unit_code"
                                header="Código"
                                sortable
                            />
                            <Column
                                field="status"
                                header="Estado"
                                body={(rowData) =>
                                    rowData.status === 1 ? (
                                        <span className="p-badge p-badge-success">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="p-badge p-badge-danger">
                                            Inactivo
                                        </span>
                                    )
                                }
                            />
                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
