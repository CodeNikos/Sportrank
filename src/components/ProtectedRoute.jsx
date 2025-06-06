import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerUsuarioActual } from './login/authent';

export function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await obtenerUsuarioActual();
                setUser(currentUser);
            } catch (error) {
                console.error('Error al verificar autenticación:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
} 