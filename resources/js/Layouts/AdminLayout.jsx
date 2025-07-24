import Header from "@/Components/Sections/HeaderAdmin";
import Sidebar from "@/Components/Sections/SidebarAdmin";
import SidebarAdminMobile from "../Components/Sections/SidebarAdminMobile";

export default function AdminLayout({ 
  currentPage,
  children,
  title,
  userName, 
}) {
  return (
    <div className="main-layout-admin" style={{ height: "100%", display: "flex", flexDirection: "row", alignItems: "stretch" }}>
      <div className="min-h-screen">
        <Sidebar />
        <SidebarAdminMobile />
      </div>
      <div className="flex-1 m-0" style={{ flex: 1}}>
        <Header currentPage={currentPage} title={title} userName={userName} />
        {children}
      </div>
    </div>
  );
}