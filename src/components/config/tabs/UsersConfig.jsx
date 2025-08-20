import React from 'react';

export const UsersConfig = ({ users, onRoleChange, onStatusChange }) => {
    return (
        <div className="tab-content">
            <h2>Gestión de Usuarios</h2>
            <div className="config-section">
                <h3>Lista de Usuarios</h3>
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.user}</td>
                                    <td>
                                        <select 
                                            className="role-select"
                                            value={user.rol || ''}
                                            onChange={(e) => onRoleChange(user.id, e.target.value)}
                                        >
                                            <option value="">Sin rol</option>
                                            <option value="Usuario">Usuario</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select 
                                            className="status-select"
                                            value={user.estado || 'P'}
                                            onChange={(e) => onStatusChange(user.id, e.target.value)}
                                        >
                                            <option value="P">Pendiente</option>
                                            <option value="A">Activo</option>
                                            <option value="I">Inactivo</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 