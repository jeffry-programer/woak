import { useEffect, useRef, useState } from "react";

export default function UploadButton({ title, value, callback }) {

    const ref = useRef(null);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(value);
    const handleUpload = (event) => {
        const file = event.target.files[0];
        setFile(file);
    }

    useEffect(() => {
        if(file){
            callback(file);
        }
    }, [file]);

    return (
        <div className="flex flex-col space-y-2">
            <p>{title}</p>
            {
                !file && !image ?
                (
                    <div className="text-center p-5 border-[0.5px] border-gray-300 rounded-md w-[65px] h-[65px] hover:cursor-pointer"
                        onClick={() => ref.current.click()}
                    >
                        <i className="pi pi-plus" style={{ fontSize: '1.5rem' }} />
                        <input type="file" accept="image/*" className="hidden" ref={ref} onChange={handleUpload} />
                    </div>
                )
                :
                (
                    <>
                        <img src={image ?  image : URL.createObjectURL(file)} alt={title} className="w-[80px] h-[80px] object-cover" />
                        <span 
                            className="text-red-500 cursor-pointer underline" onClick={() => {
                                setFile(null)
                                setImage(null)
                            }}
                        >
                            {file ? 'Eliminar' : image ? 'Reemplazar' : 'Eliminar'}
                        </span>
                    </>
                )
            }
        </div>
    )
}