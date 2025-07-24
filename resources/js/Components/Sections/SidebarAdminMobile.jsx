import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import imgProfile from '@/img/profile.png';
import { useRef } from 'react';
import { router } from '@inertiajs/react';
import { TieredMenu } from 'primereact/tieredmenu';
export default function SidebarAdminMobile() {
    const [visible, setVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        if (option === selectedOption) {
            setIsOpen(false);
        } else {
            setSelectedOption(option);
            setIsOpen(true);
        }
        if (!isOpen && option === selectedOption) {
            setIsOpen(true);
        }
    }
    const logoutUser = () => {
    router.post('/logout'), (response) => {
        console.log('deslogueado');
    }, (error => {
        toast.current.show({ severity: 'error', summary: 'Login failed', detail: 'Unexpected Error' });
    });
    };

    const menu = useRef(null);
    const items = [
        {
            label: 'View Profile',
            icon: 'pi pi-user',
        },
        {
            separator: true
        },
        {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
            logoutUser();
        }
        }
    ];

    return (
        <>
            <div className="sidebar-mobile h-10 absolute top-8 left-8 transition-all duration-300 text-5xl">
                <i
                    className="pi pi-align-left cursor-pointer"
                    onClick={() => setVisible(true)} 
                ></i>
            </div>
            <Sidebar visible={visible} onHide={() => setVisible(false)} showCloseIcon={false}>
                <div className="">
                    <div className="flex">
                        <div className="p-5 w-20 bg-white border-r border-gray-200 h-226">
                            <ul>
                                <li>
                                    <a href="#" className="block p-3 w-10 text-gray-600 hover:bg-gray-200 rounded-xl" onClick={() => handleOptionClick('home')}>
                                    <i className="pi pi-home"></i>
                                    <span className="ml-4"></span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block p-3 w-10 text-gray-600 hover:bg-gray-200 rounded-xl" onClick={() => handleOptionClick('hospital')}>
                                    <i className="pi pi-building"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="block p-3 w-10 text-gray-600 hover:bg-gray-200 rounded-xl" onClick={() => handleOptionClick('users')}>
                                    <i className="pi pi-user"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1">
                            {selectedOption === 'hospital' && (
                                <div className="p-4 md:block md:bg-white md:p-7 md:border md:border-r-gray-200 md:border-white">
                                    <h2 className="text-lg font-bold mb-5">Hospital</h2>
                                    <ul>
                                        <li>
                                            <a href="/hospital/add" className="block text-gray-600 hover:text-blue-500 py-3">
                                            Add Hospital
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/hospital/list" className="block text-gray-600 hover:text-blue-500 py-3">
                                            Hospital List
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block text-gray-600 hover:text-blue-500 py-3">
                                            Opcion Adicional
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {selectedOption === 'users' && (
                                <div className="p-4 md:block md:bg-white md:p-7 md:border  md:border-r-gray-200 md:border-white">
                                    <h2 className="text-lg font-bold mb-5">Users</h2>
                                    <ul>
                                        <li>
                                            <a href="#" className="block text-gray-600 hover:text-blue-500 py-3">
                                            Add User
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="block text-gray-600 hover:text-blue-500 py-3">
                                            Users List
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end absolute left-5 bottom-10 ">
                        <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
                        <button className="dropdown-toggle rounded-full w-10 h-10 object-cover" onClick={(e) => menu.current.toggle(e)}>
                            <img src={imgProfile} alt="Imagen de perfil" className="rounded-full w-10 h-10 object-cover" />
                        </button>
                    </div>
                </div>
            </Sidebar>
            
        </>
    )
} 