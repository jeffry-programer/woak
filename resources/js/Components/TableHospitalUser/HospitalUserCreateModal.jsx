import React, { useState, useEffect, useRef, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useHospitalUserStore } from "@/store/useHospitalUserStore";
import { useUnitStore } from "@/store/useUnitStore";
import axios from "axios";

export default function UserCreateModal({
    visible,
    onHide,
    toastRef,
    hospital_id,
}) {
    const { createUserWithHospitalAndUser, dataUser, getDataHospitalUser } =
        useHospitalUserStore();
    const { getDataUnit, dataUnit } = useUnitStore();

    const [formData, setFormData] = useState({
        hospital_id: hospital_id,
        type_user: "",
        profession_id: null,
        unit_id: null,
        status: true,
        name: "",
        email: "",
        password: "",
    });

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [professionsList, setProfessionsList] = useState([]);

    const [emailExists, setEmailExists] = useState(false);
    const [emailSearchLoading, setEmailSearchLoading] = useState(false);
    const [emailChecked, setEmailChecked] = useState(false);

    const formattedUnits = useMemo(() => {
        if (dataUnit && dataUnit.length > 0) {
            console.log("dataUnit", dataUnit);
            return dataUnit.map((unit) => ({
                label: unit.unit_name,
                value: unit.id,
            }));
        }
        return [];
    }, [dataUnit]);

    useEffect(() => {
        if (visible) {
            setFormData({
                hospital_id: hospital_id,
                type_user: "",
                profession_id: null,
                unit_id: null,
                status: true,
                name: "",
                email: "",
                password: "",
            });
            setEmailExists(false);
            setEmailSearchLoading(false);
            setEmailChecked(false);

            const fetchProfessions = async () => {
                try {
                    const professionsRes = await axios.get("/act/profession");
                    setProfessionsList(
                        professionsRes.data.map((prof) => ({
                            label: prof.title,
                            value: prof.id,
                        }))
                    );
                } catch (error) {
                    console.error("Error al cargar profesiones:", error);
                    toastRef.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Error loading professionals.",
                    });
                }
            };
            fetchProfessions();

            getDataHospitalUser();
            getDataUnit(hospital_id);
        }
    }, [visible, toastRef, getDataHospitalUser, getDataUnit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === "email") {
            setEmailChecked(false);
            setEmailExists(false);
        }
    };

    const handleDropdownChange = (name, e) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: e.value,
        }));
    };

    const handleSwitchChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            status: e.value,
        }));
    };
    const handleVerifyEmail = () => {
        if (!formData.email) {
            toastRef.current.show({
                severity: "warn",
                summary: "Advertencia",
                detail: "Please enter an email address.",
            });
            return;
        }

        setEmailSearchLoading(true);
        setEmailChecked(false);

        const emailToVerify = formData.email.toLowerCase();

        const foundUser = dataUser.find((hospitalUser) => {
            return (
                hospitalUser.user &&
                hospitalUser.user.email &&
                hospitalUser.user.email.toLowerCase() === emailToVerify
            );
        });

        setEmailExists(!!foundUser);
        setEmailChecked(true);

        if (foundUser) {
            toastRef.current.show({
                severity: "warn",
                summary: "Warn",
                detail: "Email already in use.",
            });
        } else {
            toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: "Email available.",
            });
        }

        setEmailSearchLoading(false);
    };

    const handleSubmit = async () => {
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.hospital_id ||
            !formData.type_user ||
            !formData.profession_id
        ) {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please complete all required fields",
            });
            return;
        }

        if (!emailChecked) {
            toastRef.current.show({
                severity: "warn",
                summary: "Warn",
                detail: "Please check email availability before creating the user.",
            });
            return;
        }

        if (emailExists) {
            toastRef.current.show({
                severity: "warn",
                summary: "Warn",
                detail: "The email address is already registered. A new user cannot be created with this address.",
            });
            return;
        }

        setLoadingCreate(true);
        try {
            const success = await createUserWithHospitalAndUser(formData);
            if (success) {
                toastRef.current.show({
                    severity: "success",
                    summary: "success",
                    detail: "Successfully created association of users and hospitals.",
                });
                onHide();
            } else {
                toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Could not create user and hospital link.",
                });
            }
        } catch (error) {
            console.error("Error en handleSubmit al crear usuario:", error);
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "An error occurred while trying to create the user.",
            });
        } finally {
            setLoadingCreate(false);
        }
    };

    const dialogFooter = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={loadingCreate}
                disabled={
                    (emailExists && emailChecked) ||
                    emailSearchLoading ||
                    !emailChecked ||
                    !formData.email
                }
            />
        </div>
    );

    return (
        <Dialog
            header="Create Hospital User"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={onHide}
            footer={dialogFooter}
            modal
        >
            <div className="p-fluid lg:px-20 md:px-6 pt-5">
                <div className="field col-12 mb-4">
                    <label
                        htmlFor="name"
                        className="block text-900 font-medium mb-2"
                    >
                        Name
                    </label>
                    <InputText
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label
                        htmlFor="email"
                        className="block text-900 font-medium mb-2"
                    >
                        Email / UserName
                    </label>
                    <div className="p-inputgroup">
                        <InputText
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email / UserName"
                            type="email"
                            className={
                                emailExists && emailChecked ? "p-invalid" : ""
                            }
                        />
                        <Button
                            icon={
                                emailSearchLoading
                                    ? "pi pi-spin pi-spinner"
                                    : "pi pi-search"
                            }
                            className="p-button-secondary"
                            onClick={handleVerifyEmail}
                            disabled={!formData.email || emailSearchLoading}
                            label="Check"
                        />
                    </div>
                </div>

                <div className="field col-12 mb-4">
                    <label
                        htmlFor="password"
                        className="block text-900 font-medium mb-2"
                    >
                        Password
                    </label>
                    <Password
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        toggleMask
                        feedback={false}
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label
                        htmlFor="type_user"
                        className="block text-900 font-medium mb-2"
                    >
                        User Type
                    </label>
                    <Dropdown
                        id="type_user"
                        name="type_user"
                        value={formData.type_user}
                        options={[
                            { label: "Owner", value: "owner" },
                            { label: "Worker", value: "worker" },
                        ]}
                        onChange={(e) => handleDropdownChange("type_user", e)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select User Type"
                        className="w-full"
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label
                        htmlFor="profession_id"
                        className="block text-900 font-medium mb-2"
                    >
                        Profession
                    </label>
                    <Dropdown
                        id="profession_id"
                        name="profession_id"
                        value={formData.profession_id}
                        options={professionsList}
                        onChange={(e) =>
                            handleDropdownChange("profession_id", e)
                        }
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Profession"
                        className="w-full"
                    />
                </div>

                <div className="field col-12 mb-4">
                    <label
                        htmlFor="unit_id"
                        className="block text-900 font-medium mb-2"
                    >
                        Unit
                    </label>
                    <Dropdown
                        id="unit_id"
                        name="unit_id"
                        value={formData.unit_id}
                        options={formattedUnits}
                        onChange={(e) => handleDropdownChange("unit_id", e)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Unit"
                        className="w-full"
                    />
                </div>

                <div className="field col-12 mb-4 flex align-items-center">
                    <label
                        htmlFor="status"
                        className="block text-900 font-medium mr-3"
                    >
                        Status
                    </label>
                    <InputSwitch
                        id="status"
                        name="status"
                        checked={formData.status}
                        onChange={handleSwitchChange}
                    />
                </div>
            </div>
        </Dialog>
    );
}
