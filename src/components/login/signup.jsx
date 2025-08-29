import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { db } from '../../firebase';
import './signup.css';



export function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        email: '',
        password: '',
        confirmPassword: ''
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

        if (user.password !== user.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            // Crear usuario en Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            const uid = userCredential.user.uid;
            
            // Registrar usuario en Firestore
            await addDoc(collection(db, "users"), {
                user: user.email,
                u_id: uid,
                estado: "P",
                rol: "Usuario"
            });

            // Cerrar sesión inmediatamente después del registro
            await auth.signOut();
            
            navigate('/login');
        } catch (error) {
            console.error("Error en el registro:", error);
            setError('Error al crear la cuenta');
        }
    };

    return (
        <div className="signup-container">
            <div className="card_l">
                <div className="header">
                    <h2>Registro</h2>
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
                            <label>Email</label>
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

                        <div className="form-group">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="confirmPassword" 
                                placeholder="Confirm Password" 
                                onChange={handleChange} 
                                required 
                            />
                            <label>Confirmar Contraseña</label>
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
                                <span>Mostrar Contraseña</span>
                            </label>
                        </div>

                        <button type="submit">Registrarse</button>
                    </form>
                </div>
                <div className='footer'>
                    <a href='/login'>Inicia sesión</a>
                </div>
            </div>
        </div>
    );
}