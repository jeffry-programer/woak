import { TabMenu } from "primereact/tabmenu";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { Button } from "primereact/button";
import HospitalUserList from "@/Components/TableHospitalUser/HospitalUserList";
import ListUnit from "./Unit/List";
import ListService from "./Service/List";
import DirectoryList from "./Directories/DirectoryList";
import ListSubService from "./SubService/List";
import ListSupport from "./Support/ListSupport";

const items = [
    { label: "Unidades", icon: "pi pi-home" },
    { label: "Servicios", icon: "pi pi-list" },
    { label: "Sub Servicios", icon: "pi pi-list" },
    { label: "User", icon: "pi pi-user" },
    { label: "Directories", icon: "pi pi-phone" },
    { label: "Soporte", icon: "pi pi-headphones" },
];

const TabContent = ({ hospitalId }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const response = await axios.get();
            const data = await response.data;
            if (Array.isArray(data)) {
                setData(data);
            } else {
                console.log("La data no es un arreglo");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onTabChange = (e) => {
        setActiveIndex(e.index);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Fragment>
                <Button
                    type="button"
                    icon="pi pi-eye"
                    rounded
                    outlined
                    style={{ marginRight: ".5em" }}
                />
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    style={{ marginRight: ".5em" }}
                    onClick={() => editProduct(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
            </Fragment>
        );
    };

    const showActiveTab = () => {
        switch (activeIndex) {
            case 0:
                return <ListUnit hospitalId={hospitalId} />;
            case 1:
                return <ListService hospitalId={hospitalId} />;
            case 3:
                return <HospitalUserList hospital_id={hospitalId} />;
            case 4:
                return <DirectoryList hospital_id={hospitalId} />;
            case 2:
                return <ListSubService hospitalId={hospitalId} />;
            case 5:
                return <ListSupport hospitalId={hospitalId} />;
            default:
                return <div />;
        }
    };

    return (
        <div className="">
            <h2 className="text-3xl text-gray-400 mt-3 mb-5">
                {items[activeIndex].label}
            </h2>
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={onTabChange}
                className="mb-10"
            />

            {showActiveTab()}
        </div>
    );
};

export default TabContent;
