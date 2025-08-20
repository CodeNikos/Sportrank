import React, { useState, useEffect } from 'react';
import './mostrar.css';
import { Card, CardsContainer } from './cards';
import { Sidebar } from '../rss/Sidebar';
import { db, storage } from '../../firebase';
import { collection, getDocs} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { EditPlayer } from './EditPlayer';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export function ShowPub() {
    const [players, setPlayers] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const getImageUrl = async (imagePath) => {
            try {
                const imageRef = ref(storage, imagePath);
                return await getDownloadURL(imageRef);
            } catch (error) {
                console.error("Error getting image URL:", error);
                return null;
            }
        };

        const fetchPlayers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Players"));
                const playersPromises = querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const imageUrl = await getImageUrl(data.playerpic);
                    return {
                        id: doc.id,
                        ...data,
                        playerpic: imageUrl || data.playerpic // Usa la URL o mantén la ruta original si falla
                    };
                });
                const playersData = await Promise.all(playersPromises);
                setPlayers(playersData);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };

        // Suscribirse a cambios de autenticación
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        fetchPlayers();

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const handleLogin = () => {
        // Guardar la ruta actual en sessionStorage para regresar después del login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
    };

    const downloadPlayersExcel = () => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para descargar la plantilla de jugadores');
            handleLogin();
            return;
        }

        // Crear el contenido CSV con BOM para UTF-8
        const BOM = '\uFEFF';
        const headers = [
            'nombre',
            'apellido', 
            'cedula',
            'genero',
            'fechaNacimiento',
            'nacionalidad',
            'email',
            'celular',
            'contactoEmergencia',
            'telefonoEmergencia',
            'alergias',
            'condicionMedica',
            'numero'
        ].join(',');

        // Convertir los datos de players a filas CSV
        const rows = players.map(player => [
            `"${player.nombre || ''}"`,
            `"${player.apellido || ''}"`,
            `"${player.cedula || ''}"`,
            `"${player.genero || ''}"`,
            `"${player.fechaNacimiento || ''}"`,
            `"${player.nacionalidad || ''}"`,
            `"${player.email || ''}"`,
            `"${player.celular || ''}"`,
            `"${player.contactoEmergencia || ''}"`,
            `"${player.telefonoEmergencia || ''}"`,
            `"${player.alergias || ''}"`,
            `"${player.condicionMedica || ''}"`,
            `"${player.numero || ''}"`
        ].join(','));

        const csvContent = BOM + headers + '\n' + rows.join('\n');
        
        // Crear y descargar el archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'jugadores_plantilla.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <button 
                        onClick={downloadPlayersExcel}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        📥 Descargar Plantilla de Jugadores
                    </button>
                </div>
                <CardsContainer>
                    {players.map((player) => (
                        <Card 
                            key={player.id}
                            id={player.id}
                            imageUrl={player.playerpic}
                            title={`${player.nombre} ${player.apellido}`}
                            description={player.numero}
                            onClick={() => {}} // Función vacía para evitar errores
                        />
                    ))}
                </CardsContainer>
            </div>
        </div>
    );

}
