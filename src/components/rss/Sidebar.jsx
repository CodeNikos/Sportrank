import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import './sidebar.css';
import image1 from '../../assets/Logocaribes.png';
import { Link } from 'react-router-dom';

export function Sidebar() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});

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

    const handleToggleSidebar = () => {
        setIsSidebarClosed(!isSidebarClosed);
    };

    const handleModeSwitch = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark');
    };

    const toggleItem = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="sidebar-container">
            <nav className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
                <header>
                    <div className="image-text">
                        <span className="image">
                            <img src={image1} alt="Logo" />
                        </span>

                        <div className="text logo-text">
                            <span className="name">Caribes</span>
                            <span className="profession">Ultimate Club</span>
                        </div>
                    </div>

                    <i className='bx bx-chevron-right toggle' onClick={handleToggleSidebar}></i>
                </header>

                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links">
                            <li>
                                <Link to="/">
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
                                <Link to="/temp">
                                    <i className='bx bxs-cog icon'></i>
                                    <span className="text nav-text">Configuración</span>
                                </Link>                                
                            </li>                            
                        </ul>
                    </div>

                    <div className="bottom-content">
                        <li>
                            <Link to="/temp">
                                <i className='bx bx-log-out icon'></i>
                                <span className="text nav-text">Logout</span>
                            </Link>
                        </li>

                        <li className="mode">
                            <div className="sun-moon">
                                <i className='bx bx-moon icon moon'></i>
                                <i className='bx bx-sun icon sun'></i>
                            </div>
                            <span className="mode-text text">
                                {isDarkMode ? 'Light mode' : 'Dark mode'}
                            </span>

                            <div className="toggle-switch" onClick={handleModeSwitch}>
                                <span className="switch"></span>
                            </div>
                        </li>
                    </div>
                </div>
            </nav>
        </div>
    );
} 