import { create } from 'zustand'

export const useSupportStore = create((set, get) => ({
    dataSupport: [],
    support: null,
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
        subject: '',
        hospital_id: null,
    },
    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setDataSupport: (data) => set({ dataSupport: data }),
    clearSupport: () => set({ support: null }),
    getDataSupport: async (hospitalId = null, filter = '') => {
        try {
            set({ isLoading: true });
            const response = await axios.get("/act/support", {
                params: {
                    page: get().lazyState.page + 1,
                    per_page: get().lazyState.rows,
                    hospital_id: hospitalId,
                    subject: filter,
                },
            });
            const data = await response.data;
            set({ 
                dataSupport: data.data, 
                isLoading: false, 
                totalRecords: data.total
            });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    createSupport: async (data) => {
        try {
            set({ isLoading: true });
            const response = await axios.post("/act/support", data,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 201) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataSupport(data.hospital_id);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    getOne: async(id) =>{
        try {
            set({ isLoading: true });
            const response = await axios.get(`/act/support/${id}`, {
                params: {
                    
                },
            });
            const data = await response.data;
            set({ support: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    updateSupport: async(id, data)=>{
        try {
            set({ isLoading: true });
            const response = await axios.put(`/act/support/${id}`, data,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataSupport(data.hospital_id);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    deleteSupport: async (id, hospitalId = null) => {
        try {
            set({ isLoading: true });
            const response = await axios.delete(`/act/support/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataSupport(hospitalId);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    }
}))