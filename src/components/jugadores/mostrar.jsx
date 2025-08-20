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


export function Show() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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

    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
                <CardsContainer>
                    {players.map((player) => (
                        <Card 
                            key={player.id}
                            id={player.id}
                            imageUrl={player.playerpic}
                            title={`${player.nombre} ${player.apellido}`}
                            description={player.numero}
                            onClick={setSelectedPlayerId}
                        />
                    ))}
                </CardsContainer>
            </div>
            {selectedPlayerId && (
                <EditPlayer 
                    playerId={selectedPlayerId} 
                    canEdit={isAuthenticated}
                    onClose={() => setSelectedPlayerId(null)}
                />
            )}
        </div>
    );

}