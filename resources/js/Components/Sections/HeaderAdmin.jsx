export default function Header() {
  return (
    <div className="flex justify-between items-center h-20 border-b border-gray-200 mb-4 px-8">
      <div className="">
        
      </div>
      <div className="">
        <i className="pi pi-bell text-2xl cursor-pointer" onClick={() => console.log('Notificaciones')}></i>
      </div>
    </div>
  );
}