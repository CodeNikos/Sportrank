import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/login/login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { obtenerUsuarioActual } from './components/login/authent';
import { useEffect, useState } from 'react';
import { Index } from './components/home/home';
import { Jugador } from './components/jugadores/jugador';
import { Show } from './components/jugadores/mostrar';
import { ShowPub } from './components/jugadores/mostrar_pub';
import { Temp, Ingresos, Egresos, Balance } from './components/finanzas/fin';
import { Signup } from './components/login/signup';
import { Config } from './components/config/config';


function App() {
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

    return (
        <BrowserRouter>
            <div className="app-container">

                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" replace />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/players" element={<ShowPub />} />

                        {/* Rutas protegidas */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Index />} />
                            <Route path="/add" element={<Jugador />} />
                            <Route path="/temp" element={<Temp />} />
                            <Route path="/ingresos" element={<Ingresos />} />
                            <Route path="/egresos" element={<Egresos />} />
                            <Route path="/balance" element={<Balance />} />
                            <Route path="/config" element={<Config />} />
                        </Route>

                        {/* Redirección por defecto */}
                        <Route path="/" element={<Navigate to="/players" replace />} />
                        
                        {/* Ruta 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App; 