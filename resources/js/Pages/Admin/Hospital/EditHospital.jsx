import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from "react";
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';

import { useHospitalStore } from '@/store/useHospitalStore';

export default function EditHospital() {
  const toast = useRef(null);
  const { props } = usePage();
  const hospitalId = props.id; 

  const { getOneHospital, updateHospital, isLoading } = useHospitalStore();

  const defaultForm = {
    hospital_name: '',
    description: '',
    general_details: '',
    location: '',
    latitude: '0',
    longitude: '0',
    image: null, 
    hospital_code: '',
  };

  const [form, setForm] = useState(defaultForm);
  const [currentImageUrl, setCurrentImageUrl] = useState(null); 
  const [fileToUpload, setFileToUpload] = useState(null); 

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (hospitalId) {
          const hospitalData = await getOneHospital(hospitalId);
          if (hospitalData) {
              setForm({
                  hospital_name: hospitalData.hospital_name || '',
                  description: hospitalData.description || '',
                  general_details: hospitalData.general_details || '',
                  location: hospitalData.location || '',
                  latitude: hospitalData.latitude || '0',
                  longitude: hospitalData.longitude || '0',
                  hospital_code: hospitalData.hospital_code || '',
                  image: null,
              });
              setCurrentImageUrl(hospitalData.image);
          } else {
              toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load hospital data.' });
          }
      }
    };

    fetchHospitalData();
  }, [hospitalId, getOneHospital]);

  const onImageSelect = (e) => {
    if (e.files && e.files.length > 0) {
      setFileToUpload(e.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.files[0]));
    } else {
      setFileToUpload(null);
      setCurrentImageUrl(props.hospital?.image || null); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    return form.hospital_name.trim() !== '' &&
      form.description.trim() !== '' &&
      form.general_details.trim() !== '' &&
      form.location.trim() !== '' &&
      form.hospital_code.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current.show({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all required fields.' });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in form) {
      if (key !== 'image' && form[key] !== null) {
            formDataToSend.append(key, form[key]);
      }
    }
      
    if (fileToUpload) {
      formDataToSend.append('image', fileToUpload);
    } else if (currentImageUrl && !fileToUpload) {
    }

    try {
      const success = await updateHospital(hospitalId, formDataToSend);

      if (success) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Hospital updated successfully.' });
        setTimeout(() => {
            window.location.href = '/hospital/list'; 
        }, 1000); 
      } else {
        toast.current.show({ severity: 'error', summary: 'Update Failed', detail: 'Could not update hospital. Check console for details.' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'General Error', detail: error.message });
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Toast ref={toast}></Toast>
      <Head title="Edit Hospital" />
      <div className="py-8 px-15">
        <div className="max-w-auto mx-auto sm:px-8 lg:px-10">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-3xl text-gray-400 mt-3 mb-5">Edit Hospital</h2>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-5">
                  <label htmlFor="hospital_code" className="font-bold text-gray-600 mb-3">Hospital Code</label>
                  <InputText 
                      id="hospital_code" 
                      name="hospital_code" 
                      type="text" 
                      className="w-full p-2 mb-12" 
                      onChange={handleChange} 
                      value={form.hospital_code}
                  />
                </div>
                <div className="flex flex-col mb-5">
                  <label htmlFor="hospital_name" className="font-bold text-gray-600 mb-3">Hospital Name</label>
                  <InputText 
                    id="hospital_name" 
                    name="hospital_name" 
                    type="text" 
                    className="w-full p-2 mb-12" 
                    onChange={handleChange} 
                    value={form.hospital_name} 
                  />
                </div>
                <div className="flex flex-col mb-5">
                  <label htmlFor="location" className="font-bold text-gray-600 mb-3">Location</label>
                  <InputText 
                    id="location" 
                    type="text" 
                    name="location" 
                    className="w-full p-2 mb-4" 
                    onChange={handleChange} 
                    value={form.location}
                  />
                </div>
                <div className="flex flex-col mb-5">
                  <label htmlFor="description" className="font-bold mb-3 text-gray-600">Description</label>
                  <InputTextarea 
                    id="description" 
                    name="description" 
                    rows={5} 
                    className="w-full p-2 mb-4" 
                    onChange={handleChange} 
                    value={form.description}
                  />
                </div>
                <div className="flex flex-col mb-5">
                    <label htmlFor="general_details" className="font-bold text-gray-600 mb-3">General Details</label>
                    <InputTextarea 
                      id="general_details" 
                      name="general_details" 
                      rows={5} 
                      className="w-full p-2 mb-4" 
                      onChange={handleChange} 
                      value={form.general_details}
                    />
                </div>
                <div className="flex flex-col mb-5">
                  <label htmlFor="image" className="font-bold text-gray-600 mb-3">Hospital Image</label>
                    {currentImageUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Current Image:</p>
                        <img src={currentImageUrl} alt="Current Hospital" className="w-32 h-32 object-cover rounded-md mt-2" />
                      </div>
                    )}
                    <FileUpload 
                        mode="basic" 
                        name="image" 
                        accept="image/*" 
                        maxFileSize={1000000} 
                        onSelect={onImageSelect} 
                        auto={false} 
                        chooseLabel="Choose New Image" 
                    />
                    {fileToUpload && <span className="text-sm mt-2 text-gray-600">New file selected: {fileToUpload.name}</span>}
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    label="Cancel"
                    icon="pi pi-times"
                    onClick={() => window.history.back()} 
                    className="mr-5 p-button-secondary" 
                    style={{ marginRight: '.5em' }}
                  />
                  <Button 
                    type="submit" 
                    label="Save Changes" 
                    icon="pi pi-check"
                    loading={isLoading} 
                    className="p-button-primary" 
                    disabled={isLoading || !validateForm()} 
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}