import React from 'react';

export const SystemConfig = () => {
    return (
        <div className="tab-content">
            <h2>Configuración del Sistema</h2>
            <div className="config-section">
                <h3>Parámetros del Sistema</h3>
                <form className="config-form">
                    <div className="form-group">
                        <label>Idioma</label>
                        <select>
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tema</label>
                        <select>
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                        </select>
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
}; 