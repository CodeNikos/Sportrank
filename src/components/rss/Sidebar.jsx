import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import './sidebar.css';
import image1 from '../../assets/Logocaribes.png';
import { Link } from 'react-router-dom';
import { cerrarSesion } from '../../components/login/authent';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function Sidebar() {
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const navigate = useNavigate();
    const [sidebarColor, setSidebarColor] = useState('#B1D1D3');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [clubData, setClubData] = useState({
        nombre: '',
        deporte: ''
    });

    useEffect(() => {
        // Aplicar colores guardados inmediatamente al montar
        const savedSidebarColor = localStorage.getItem('sidebarColor');
        if (savedSidebarColor) {
            setSidebarColor(savedSidebarColor);
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.backgroundColor = savedSidebarColor;
            }
        }

        // Suscribirse a cambios de autenticación
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        const fetchClubInfo = async () => {
            try {
                const clubRef = doc(db, 'club', 'config');
                const clubDoc = await getDoc(clubRef);

                if (clubDoc.exists()) {
                    const data = clubDoc.data();
                    setClubData(data);
                    
                    // Guardar y aplicar el color del sidebar
                    if (data.sidebarColor) {
                        localStorage.setItem('sidebarColor', data.sidebarColor);
                        setSidebarColor(data.sidebarColor);
                        const sidebar = document.querySelector('.sidebar');
                        if (sidebar) {
                            sidebar.style.backgroundColor = data.sidebarColor;
                        }
                    }
                    
                    console.log('Datos del club cargados:', data.nombre, data.deporte);
                }
            }
            catch (error) {
                console.error('Error al cargar datos del club:', error);
                toast.error('Error al cargar la configuración');
            }
        };

        fetchClubInfo();

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 414) {
                setIsSidebarClosed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleColorChange = (event) => {
            const newColor = event.detail.sidebarColor;
            setSidebarColor(newColor);
            localStorage.setItem('sidebarColor', newColor);
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.backgroundColor = newColor;
            }
        };

        const handleClubDataChange = (event) => {
            setClubData(prevData => ({
                ...prevData,
                nombre: event.detail.nombre,
                deporte: event.detail.deporte
            }));
        };

        window.addEventListener('appColorsChange', handleColorChange);
        window.addEventListener('clubDataChange', handleClubDataChange);
        
        return () => {
            window.removeEventListener('appColorsChange', handleColorChange);
            window.removeEventListener('clubDataChange', handleClubDataChange);
        };
    }, []);

    const handleToggleSidebar = () => {
        setIsSidebarClosed(!isSidebarClosed);
    };

    const handleLogout = async () => {
        try {
            await cerrarSesion();
            localStorage.removeItem('sidebarColor'); // Limpiar el color del sidebar
            window.location.href = '/login'; // Forzar la redirección
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            toast.error('Error al cerrar sesión');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const toggleItem = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="sidebar-container">
            <nav className={`sidebar ${isSidebarClosed ? 'close' : ''}`} style={{ backgroundColor: sidebarColor }}>
                <header>
                    <div className="image-text">
                        <span className="image">
                            <img src={image1} alt="Logo" />
                        </span>

                        <div className="text logo-text">
                            <span className="name">{clubData.nombre}</span>
                            <span className="profession">{clubData.deporte}</span>
                        </div>
                    </div>

                    <i className='bx bx-chevron-right toggle' onClick={handleToggleSidebar}></i>
                </header>

                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links">
                            <li>
                                <Link to="/home">
                                    <i className='bx bx-home-alt icon'></i>
                                    <span className="text nav-text">Home</span>
                                </Link>
                            </li>

                            <li className="nav-link">
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    toggleItem('plantilla');
                                }}>
                                    <i className='bx bxs-group icon'></i>
                                    <span className="text nav-text">Plantilla</span>
                                </Link>
                            </li>
                            {expandedItems['plantilla'] && (
                                <>
                                    <li className="sub-item">
                                        <Link to="/add">
                                            <i className='bx bx-plus-medical icon'></i>                                            
                                            <span className="text nav-text">Agregar</span>
                                        </Link>
                                    </li>
                                    <li className="sub-item">
                                        <Link to="/players">
                                            <i className='bx bx-desktop icon'></i>
                                            <span className="text nav-text">Mostrar</span>
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="nav-link">
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    toggleItem('finanzas');
                                }}>
                                    <i className='bx bx-wallet icon'></i>
                                    <span className="text nav-text">Finanzas</span>
                                </Link>
                            </li>
                            {expandedItems['finanzas'] && (
                                <>
                                    <li className="sub-item">
                                        <Link to="/ingresos">
                                            <i className='bx bx-money icon'></i>                                            
                                            <span className="text nav-text">Ingresos</span>
                                        </Link>
                                    </li>
                                    <li className="sub-item">
                                        <Link to="/egresos">
                                            <i className='bx bxs-shopping-bag icon'></i>
                                            <span className="text nav-text">Gastos</span>
                                        </Link>
                                    </li>
                                    <li className="sub-item">
                                        <Link to="/balance">
                                            <i className='bx bx-calculator icon'></i>
                                            <span className="text nav-text">Balance</span>
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="nav-link">
                                <Link to="/temp">
                                    <i className='bx bx-bar-chart-alt-2 icon'></i>
                                    <span className="text nav-text">Estadísticas</span>
                                </Link>
                            </li>

                            <li className="nav-link">
                                <Link to="/temp">
                                    <i className='bx bx-trophy icon'></i>
                                    <span className="text nav-text">Torneos</span>
                                </Link>                                
                            </li>

                            <li className="nav-link">
                                <Link to="/config">
                                    <i className='bx bxs-cog icon'></i>
                                    <span className="text nav-text">Configuración</span>
                                </Link>                                
                            </li>                            
                        </ul>
                    </div>

                    <div className="bottom-content">
                        <li>
                            <Link to="#" onClick={(e) => {
                                e.preventDefault();
                                if (isAuthenticated) {
                                    handleLogout();
                                } else {
                                    handleLogin();
                                }
                            }}>
                                <i className={isAuthenticated ? 'bx bx-log-out icon' : 'bx bx-log-in icon'}></i>
                                <span className="text nav-text">{isAuthenticated ? 'Logout' : 'Login'}</span>
                            </Link>
                        </li>
                    </div>
                </div>
            </nav>
        </div>
    );
} 