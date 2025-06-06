import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export const useClubConfig = () => {
    const [clubData, setClubData] = useState({
        nombre: '',
        deporte: '',
        sidebarColor: '#B1D1D3',
        backgroundColor: '#ececec'
    });

    useEffect(() => {
        const savedBackgroundColor = localStorage.getItem('backgroundColor');
        const savedSidebarColor = localStorage.getItem('sidebarColor');
        
        if (savedBackgroundColor) {
            applyBackgroundColor(savedBackgroundColor);
        }

        fetchClubData();
    }, []);

    const fetchClubData = async () => {
        try {
            const clubRef = doc(db, 'club', 'config');
            const clubDoc = await getDoc(clubRef);
            
            if (clubDoc.exists()) {
                const data = clubDoc.data();
                setClubData(data);
                
                if (data.backgroundColor) {
                    localStorage.setItem('backgroundColor', data.backgroundColor);
                    applyBackgroundColor(data.backgroundColor);
                }
                
                if (data.sidebarColor) {
                    localStorage.setItem('sidebarColor', data.sidebarColor);
                    applySidebarColor(data.sidebarColor);
                }
            }
        } catch (error) {
            console.error('Error al cargar datos del club:', error);
            toast.error('Error al cargar la configuración');
        }
    };

    const applyBackgroundColor = (color) => {
        document.documentElement.style.setProperty('--background-color', color);
        document.body.style.backgroundColor = color;
        
        const appContainer = document.querySelector('.app-container');
        const mainContent = document.querySelector('.main-content');
        
        if (appContainer) appContainer.style.backgroundColor = color;
        if (mainContent) mainContent.style.backgroundColor = color;
    };

    const applySidebarColor = (color) => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.backgroundColor = color;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClubData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clubRef = doc(db, 'club', 'config');
            await setDoc(clubRef, clubData);
            
            if (clubData.backgroundColor) {
                localStorage.setItem('backgroundColor', clubData.backgroundColor);
                applyBackgroundColor(clubData.backgroundColor);
            }
            
            if (clubData.sidebarColor) {
                localStorage.setItem('sidebarColor', clubData.sidebarColor);
                applySidebarColor(clubData.sidebarColor);
            }

            const colorEvent = new CustomEvent('appColorsChange', {
                detail: {
                    sidebarColor: clubData.sidebarColor,
                    backgroundColor: clubData.backgroundColor
                }
            });
            window.dispatchEvent(colorEvent);

            const clubEvent = new CustomEvent('clubDataChange', {
                detail: {
                    nombre: clubData.nombre,
                    deporte: clubData.deporte
                }
            });
            window.dispatchEvent(clubEvent);
            
            toast.success('Configuración guardada exitosamente');
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
            toast.error('Error al guardar la configuración');
        }
    };

    return {
        clubData,
        handleInputChange,
        handleSubmit
    };
}; 