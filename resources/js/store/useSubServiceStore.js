import { create } from 'zustand'

export const useSubServiceStore = create((set, get) => ({
    dataSubService: [],
    subService: null,
    isLoading: false,
    totalRecords: 0,
    lazyState: {
        first: 0,
        rows: 10,
        page: 0,
        sub_service_name: '',
        hospital_id: null
    },
    setLazyState: (lazyState) => set({ lazyState }),
    setTotalRecords: (totalRecords) => set({ totalRecords }),
    setDataSubService: (data) => set({ dataSubService: data }),
    clearSubService: () => set({ subService: null }),
    getDataSubService: async (hospitalId = null, filter = '') => {
        try {
            set({ isLoading: true });
            const response = await axios.get("/act/sub-service", {
                params: {
                    page: get().lazyState.page + 1,
                    per_page: get().lazyState.rows,
                    sub_service_name: filter,
                    hospital_id: hospitalId,
                },
            });
            const data = await response.data;
            set({ 
                dataSubService: data.data, 
                isLoading: false, 
                totalRecords: data.total
            });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },    
    createSubService: async (hospitalId, data) => {
        try {
            set({ isLoading: true });
            const formData = new FormData();
            formData.append('sub_service_name', data.sub_service_name);
            formData.append('service_id', data.service_id);
            formData.append('sub_service_image', data.sub_service_image);

            const response = await axios.post("/act/sub-service", formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status !== 201) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataSubService(hospitalId);
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
            const response = await axios.get(`/act/sub-service/${id}`, {
                params: {
                    
                },
            });
            const data = await response.data;
            set({ subService: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
        }
    },
    updateSubService: async(id, hospitalId, data)=>{
        try {
            set({ isLoading: true });
            const formData = new FormData();
            formData.append('sub_service_name', data.sub_service_name);
            formData.append('sub_service_image', data.sub_service_image);
            formData.append('service_id', data.service_id);
            formData.append('_method','PUT');
            const response = await axios.post(`/act/sub-service/${id}`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataSubService(hospitalId);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    },
    deleteSubService: async (id, hospitalId) => {
        try {
            set({ isLoading: true });
            const response = await axios.delete(`/act/sub-service/${id}`);
            if (response.status !== 200) {
                throw new Error(response.data.message);
            }
            set({ isLoading: false });
            get().getDataSubService(hospitalId);
            return true;
        } catch (error) {
            set({ isLoading: false });
            console.log(error);
            return false;
        }
    }
}));



