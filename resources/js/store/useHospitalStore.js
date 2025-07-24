import { create } from 'zustand';

export const useHospitalStore = create((set, get) => ({
    hospitals: [],
    hospital: null,
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
    },

    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setHospitals: (data) => set({ hospitals: data }),
    setHospital: (data) => set({ hospital: data }),
    clearHospital: () => set({ hospital: null }),

    createHospital: async (hospitalData) => {
        set({ isLoading: true });
        try {
            const response = await axios.post('/act/hospital', hospitalData);
            await get().getAllHospitals();
            return { success: true };
        } catch (error) {
            console.log(error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'An error occurred while creating the hospital'
            };
        }
        finally {
            set({ isLoading: false });
        }
    },

    getAllHospitals: async (filter = '') => {
        set({ isLoading: true });
        try {
            const currentLazyState = get().lazyState;
            
            const response = await axios.get("/act/hospital", {
                params: {
                    page: currentLazyState.page + 1,
                    per_page: currentLazyState.rows,
                    hospital_name: filter,
                },
            });

            const data = response.data;
            set({
                hospitals: data.data,
                totalRecords: data.total,
            });
        } catch (error) {
            console.error("Error fetching hospitals:", error);
            set({ hospitals: [], totalRecords: 0 });
        } finally {
            set({ isLoading: false });
        }
    },

    getOneHospital: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/act/hospital/${id}`);
            const data = response.data;
            set({ hospital: data});
            return data;
        } catch (error) {
            console.log(error);
            set({ hospital: null });
            return null;
        }
        finally {
            set({ isLoading: false });
        }
    },

    updateHospital: async (id, updates) => {
        set({ isLoading: true });
        try {
            const response = await axios.put(`/act/hospital/${id}`, updates);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            await get().getAllHospitals();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
        finally {
            set({ isLoading: false });
        }
    },

    deleteHospital: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.delete(`/act/hospital/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            await get().getAllHospitals();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
        finally {
            set({ isLoading: false });
        }
    },

    getTrashHospitals: async (filter = '') => {
        try {
            const response = await axios.get("/act/hospital", {
                params: {
                    trashed: true,
                    name: filter
                },
            });
            const data = response.data;
            set({
                hospitals: data.data,
                isLoading: false,
                totalRecords: data.total
            });
        } catch (error) {
            console.log(error);
        }
    },

    restoreHospital: async (id) => {
        try {
            const response = await axios.post(`/act/hospital/${id}/restore`);
            await get().getAllHospitals();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    forceDeleteHospital: async (id) => {
        try {
            const response = await axios.delete(`/act/hospital/${id}/force`);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
}));

export default useHospitalStore;