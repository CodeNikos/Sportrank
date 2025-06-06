import React from 'react';

export const PlayersConfig = () => {
    return (
        <div className="tab-content">
            <h2>Configuración de Jugadores</h2>
            <div className="config-section">
                <h3>Parámetros de Jugadores</h3>
                <form className="config-form">
                    <div className="form-group">
                        <label>Edad Mínima</label>
                        <input type="number" min="0" />
                    </div>
                    <div className="form-group">
                        <label>Edad Máxima</label>
                        <input type="number" min="0" />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
}; 