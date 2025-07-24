import { create } from 'zustand';

export const useDirectoryStore = create((set, get) => ({
    dataDirectory: [],
    directoryEntry: null, 
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
        search_term: '', 
        hospital_id: null,
    },

    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setDataDirectory: (data) => set({ dataDirectory: data }),

    getDirectoryData: async (fetchParams = {}) => {
        set({ isLoading: true });
        try {
            const currentLazyState = get().lazyState;
            const effectiveParams = {
                first: fetchParams.first ?? currentLazyState.first,
                rows: fetchParams.rows ?? currentLazyState.rows,
                page: fetchParams.page ?? currentLazyState.page,
                search_term: fetchParams.search_term ?? currentLazyState.search_term,
                hospital_id: fetchParams.hospital_id ?? currentLazyState.hospital_id,
            };

            const response = await axios.get("/act/directory", { 
                params: {
                    page: effectiveParams.page + 1,
                    per_page: effectiveParams.rows,
                    search_term: effectiveParams.search_term,
                    hospital_id: effectiveParams.hospital_id,
                },
            });
            const data = await response.data;
            set({ 
                dataDirectory: data.data,
                totalRecords: data.total,
                isLoading: false,
                lazyState: {
                    ...effectiveParams,
                    first: effectiveParams.first || 0,
                    rows: effectiveParams.rows || 10,
                    page: effectiveParams.page || 0,
                }
            });
        } catch (error) {
            set({ isLoading: false });
            console.error("Error al obtener datos del directorio:", error);
            set({ dataDirectory: [], totalRecords: 0 });
        }
    },

    createDirectoryEntry: async (data) => {
        set({ isLoading: true });
        try {
            const response = await axios.post("/act/directory", data);
            if (response.status !== 201) {
                throw new Error(response.data.message || "Error creating directory entry");
            }
            set({ isLoading: false });
            get().getDirectoryData(get().lazyState); 
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.error("Error al crear entrada de directorio:", error);
            return false;
        }
    },

    getOneDirectoryEntry: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/act/directory/${id}`);
            const data = await response.data;
            set({ directoryEntry: data, isLoading: false });
            return data;
        } catch (error) {
            set({ isLoading: false });
            console.error("Error al obtener entrada de directorio:", error);
            return null;
        }
    },

    updateDirectoryEntry: async (id, data) => {
        set({ isLoading: true });
        try {
            const response = await axios.put(`/act/directory/${id}`, data);
            if (response.status !== 200) {
                throw new Error(response.data.message || "Error updating directory entry");
            }
            set({ isLoading: false });
            get().getDirectoryData(get().lazyState); 
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.error("Error al actualizar entrada de directorio:", error);
            return false;
        }
    },

    deleteDirectoryEntry: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.delete(`/act/directory/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message || "Error deleting directory entry");
            }
            set({ isLoading: false });
            get().getDirectoryData(get().lazyState);
            return true;
            } catch (error) {
            set({ isLoading: false });
            console.error("Error al eliminar entrada de directorio:", error);
            return false;
        }
    }
}));

export default useDirectoryStore;