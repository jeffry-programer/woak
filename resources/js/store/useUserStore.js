import { create } from 'zustand'

export const useUserStore = create((set, get) => ({
    dataUser: [],
    user: null,
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
        user_name: '',
    },
    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setDataUser: (data) => set({ dataUser: data }),
    getDataUser: async (filter = '') => {
        try {
            set({ isLoading: true });
            const response = await axios.get("/act/user", {
                params: {
                    page: get().lazyState.page + 1,
                    per_page: get().lazyState.rows,
                    name: filter,
                },
            });
            const data = await response.data;
            set({ 
                dataUser: data.data, 
                isLoading: false, 
                totalRecords: data.total
            });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },    
    createUser: async (data) => {
        try {
            set({ isLoading: true });
            const response = await axios.post("/act/user", data);
            if (response.status !== 201) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
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
            const response = await axios.get(`/act/user/${id}`, {
                params: {
                    
                },
            });
            const data = await response.data;
            set({ user: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    updateUser: async(id, data)=>{
        try {
            set({ isLoading: true });
            const response = await axios.put(`/act/user/${id}`, data);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    deleteUser: async (id) => {
        try {
            set({ isLoading: true });
            const response = await axios.delete(`/act/user/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataUser();
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    getTrashUsers: async (filter = '') => {
        try {
            const response = await axios.get("/act/user", {
                params: {
                    trashed: true,
                    name: filter
                },
            });
            const data = await response.data;
            set({ 
                dataUser: data.data, 
                isLoading: false, 
                totalRecords: data.total
            });
        } catch (error) {
            console.log(error);
        }
    },
    restoreUser: async (id) => {
        try {
            const response = await axios.post(`/act/user/${id}/restore`);
            await response.data;
            return true;
        } catch (error) {
            console.log(error);
        }
    },
    forceDeleteUser: async (id) => {
        try {
            const response = await axios.delete(`/act/user/${id}/force`);
            await response.data;
            return true;
        } catch (error) {
            console.log(error);
        }
    },
}));



