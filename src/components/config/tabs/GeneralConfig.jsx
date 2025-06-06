import React from 'react';

export const GeneralConfig = ({ clubData, onInputChange, onSubmit }) => {
    return (
        <div className="tab-content">
            <h2>Configuración General</h2>
            <div className="config-section">
                <h3>Información del Club</h3>
                <form className="config-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Nombre del Club</label>
                        <input 
                            type="text" 
                            name="nombre"
                            value={clubData.nombre}
                            onChange={onInputChange}
                            placeholder="Ingrese el nombre del club" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Deporte/Entidad</label>
                        <input 
                            type="text" 
                            name="deporte"
                            value={clubData.deporte}
                            onChange={onInputChange}
                            placeholder="Ingrese el deporte o entidad" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Color del Sidebar</label>
                        <input 
                            type="color" 
                            name="sidebarColor"
                            value={clubData.sidebarColor}
                            onChange={onInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color de Fondo</label>
                        <input 
                            type="color" 
                            name="backgroundColor"
                            value={clubData.backgroundColor}
                            onChange={onInputChange}
                        />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
}; 