import { create } from "zustand";

export const useUnitStore = create((set, get) => ({
    dataUnit: [],
    unit: null,
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
        unit_name: "",
        hospital_id: null,
    },
    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setDataUnit: (data) => set({ dataUnit: data }),
    clearUnit: () => set({ unit: null }),
    getDataUnit: async (hospitalId = null, filter = "", service_id = null) => {
        try {
            set({ isLoading: true });
            const response = await axios.get("/act/unit", {
                params: {
                    page: get().lazyState.page + 1,
                    per_page: get().lazyState.rows,
                    hospital_id: hospitalId,
                    unit_name: filter,
                    service_id: service_id,
                },
            });
            const data = await response.data;
            set({
                dataUnit: data.data,
                isLoading: false,
                totalRecords: data.total,
            });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    createUnit: async (data) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();
            formData.append("unit_name", data.unit_name);
            formData.append("hospital_id", data.hospital_id);
            formData.append("unit_image", data.unit_image);
            const response = await axios.post("/act/unit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 201) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataUnit(data.hospital_id);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    getOne: async (id) => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`/act/unit/${id}`, {
                params: {},
            });
            const data = await response.data;
            set({ unit: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    updateUnit: async (id, data) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();
            formData.append("unit_name", data.unit_name);
            formData.append("hospital_id", data.hospital_id);
            formData.append("status", data.status);
            formData.append("_method", "PUT");
            if (data.unit_image) {
                formData.append("unit_image", data.unit_image);
            }
            const response = await axios.post(`/act/unit/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataUnit(data.hospital_id);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    deleteUnit: async (id, hospitalId = null) => {
        try {
            set({ isLoading: true });
            const response = await axios.delete(`/act/unit/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataUnit(hospitalId);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
}));
