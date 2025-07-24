import { create } from "zustand";

export const useServiceStore = create((set, get) => ({
    dataService: [],
    service: null,
    dataUnits: [],
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
        service_name: "",
        hospital_id: null,
    },
    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setDataService: (data) => set({ dataService: data }),
    clearService: () => set({ service: null }),
    getDataService: async (hospitalId = null, filter = "") => {
        try {
            set({ isLoading: true });
            const response = await axios.get("/act/service", {
                params: {
                    page: get().lazyState.page + 1,
                    per_page: get().lazyState.rows,
                    hospital_id: hospitalId,
                    service_name: filter,
                },
            });
            const data = await response.data;
            set({
                dataService: data.data,
                isLoading: false,
                totalRecords: data.total,
            });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    createService: async (data, hospital_id) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();
            formData.append("service_name", data.service_name);
            formData.append("hospital_id", hospital_id);
            formData.append("service_image", data.service_image);

            const response = await axios.post("/act/service", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 201) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataService(hospital_id);
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
            const response = await axios.get(`/act/service/${id}`, {
                params: {},
            });
            const data = await response.data;
            set({ dataUnits: data.units, service: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    updateService: async (id, data) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();
            formData.append("service_name", data.service_name);
            formData.append("hospital_id", data.hospital_id);
            formData.append("service_image", data.service_image);
            formData.append("_method", "PUT");
            const response = await axios.post(`/act/service/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataService(data.hospital_id);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    deleteService: async (id) => {
        try {
            set({ isLoading: true });
            const response = await axios.delete(`/act/service/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataService();
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    syncServiceUnits: async (id, units) => {
        try {
            set({ isLoading: true });
            const response = await axios.post(
                `/act/service/attach-units/${id}`,
                {
                    units,
                }
            );
            set({ isLoading: false });
            return response;
        } catch (error) {
            console.error("Error syncing units:", error);
            set({ isLoading: false });
            throw error;
        }
    },
}));
