import { create } from 'zustand';

export const useHospitalUserStore = create((set, get) => ({
  dataUser: [],
  user: null,
  isLoading: false,
  totalRecords: 0,
  lazyState: {
    first: 0,
    rows: 10,
    page: 0,
    user_name: '',
    hospital_id: '',
  },
  setLazyState: (lazyState) => set({ lazyState }),
  setTotalRecords: (totalRecords) => set({ totalRecords }),
  setDataUser: (data) => set({ dataUser: data }),

  createUserHospital: async (user) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/act/hospitalUser', user);
      set((state) => ({ dataUser: [...state.dataUser, response.data] }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createUserWithHospitalAndUser: async (userDataAndHospital) => {
    set({ isLoading: true });
    try {
      const response = await axios.post('/act/hospitalUser/with-user', userDataAndHospital);
      await get().getDataHospitalUser();  
      return true;
    } catch (error) {
      console.error("Error al crear usuario y usuario de hospital:", error.response?.data || error.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getDataHospitalUser: async (fetchParams = {}) => {
    set({ isLoading: true });
    try {
      const currentLazyState = get().lazyState;
      const effectiveParams = {
        first: fetchParams.first ?? currentLazyState.first,
        rows: fetchParams.rows ?? currentLazyState.rows,
        page: fetchParams.page ?? currentLazyState.page,
        user_name: fetchParams.user_name ?? currentLazyState.user_name,
        hospital_id: fetchParams.hospital_id ?? currentLazyState.hospital_id,
        HospitalDetails: fetchParams.HospitalDetails ?? currentLazyState.HospitalDetails, // Asegúrate de que esta propiedad exista en tu lazyState si la usas
      };

      const response = await axios.get('/act/hospitalUser', {
        params: {
          page: effectiveParams.page + 1,
          per_page: effectiveParams.rows,
          user_name: effectiveParams.user_name,
          hospital_id: effectiveParams.hospital_id,
          HospitalDetails: effectiveParams.HospitalDetails,
        },
      });

      const data = await response.data;
      set({
        dataUser: data.data,
        totalRecords: data.total,
        lazyState: {
          ...effectiveParams,
          first: effectiveParams.first || 0,
          rows: effectiveParams.rows || 10,
          page: effectiveParams.page || 0,
        }
      });
    } catch (error) {
    console.error("Error al obtener usuarios del hospital:", error);
    set({ dataUser: [], totalRecords: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  getOneHospitalUser: async (id) => {
    try {
      const response = await axios.get(`/act/hospitalUser/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  updateHospitalUser: async (id, updates) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`/act/hospitalUser/${id}`, updates);
      set((state) => ({ dataUser: state.dataUser.map((user) => user.id === id ? { ...user, ...updates } : user) }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteHospitalUser: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/act/hospitalUser/${id}`);
      await get().getDataHospitalUser({
            hospital_id: get().lazyState.hospital_id,
            user_name: get().lazyState.user_name,
            page: get().lazyState.page,
            rows: get().lazyState.rows,
            first: get().lazyState.first,
        }); 
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useHospitalUserStore;