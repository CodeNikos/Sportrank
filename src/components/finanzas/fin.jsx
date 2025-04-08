import { useState, useEffect } from 'react';
import { Sidebar } from '../rss/Sidebar';
import '../finanzas/fin.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export function Ingresos(){
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');

    // Aquí deberías agregar tu lógica para obtener los jugadores de tu base de datos
     useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const q = collection(db, 'Players');
                const qSnapshot = await getDocs(q);
                const postq = qSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Jugadores obtenidos:", postq);
                setPlayers(postq);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };
        fetchPlayers();
    }, []);

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
                <h2>INGRESOS</h2>
                <div className="card-container">
                    <div className="select-card">
                        <h3>Seleccionar Jugador</h3>
                        <select 
                            value={selectedPlayer}
                            onChange={(e) => setSelectedPlayer(e.target.value)}
                            className="player-select"
                        >
                            <option value="">Seleccione un jugador</option>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {`${player.nombre || ''} ${player.apellido || ''}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export function Egresos(){

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
            <h2>Egresos</h2>
            </div>
        </div>    
        
            );

}

export function Balance(){

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
            <h2>Balance</h2>
            </div>
        </div>    
        
            );

}

export function Temp(){

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
            <h2>En construcción</h2>
            </div>
        </div>    
        
            );

}