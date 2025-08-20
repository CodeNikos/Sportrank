import '../login/login.css';
import { useState } from "react";
import { ImageCarousel } from './carousel'
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from './authent';

export function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleCheckboxChange = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = ({ target: { value, name } }) =>
        setUser({ ...user, [name]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await iniciarSesion(user.email, user.password);
            
            // Verificar si hay una ruta guardada para redirigir después del login
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin'); // Limpiar la ruta guardada
                navigate(redirectPath);
            } else {
                navigate('/home'); // Ruta por defecto si no hay redirección guardada
            }
        } catch (error) {
            console.error("Error en el login:", error);
            if (error.message === 'PENDIENTE_APROBACION') {
                setError('Tu cuenta está pendiente de aprobación por el administrador.');
            } else if (error.message === 'Usuario no encontrado') {
                setError('Usuario no encontrado. Por favor, regístrate primero.');
            } else {
                setError('Error al iniciar sesión. Verifica tus credenciales.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="card_l">
                <div className='header'>
                    <div className='img1'>
                        <ImageCarousel />
                    </div>
                </div>
                <div className='body'>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                onChange={handleChange} 
                                required 
                            />
                            <label>Usuario</label>
                        </div>

                        <div className="form-group">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                placeholder="Password" 
                                onChange={handleChange} 
                                required 
                            />
                            <label>Contraseña</label>
                        </div>

                        <div className='showpass'>
                            <input 
                                type="checkbox" 
                                name="show-password" 
                                className="show-password" 
                                id="show-password" 
                                onChange={handleCheckboxChange} 
                            />
                            <label className="label-show-password" htmlFor="show-password">
                                <span>Show Password</span>
                            </label>
                        </div>

                        <button type="submit">Log In</button>
                    </form>
                </div>
                <div className='footer'>
                    <p>Si no tienes cuenta puedes crearla aquí <a href='/signup'>Registrate.</a></p>
                </div>
            </div>
        </div>
    );
}