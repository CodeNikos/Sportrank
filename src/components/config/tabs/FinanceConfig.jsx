import React, { useState } from 'react';
import { useAccount } from '../../../hooks/useAccount';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './FinanceConfig.css';

export const FinanceConfig = () => {
    const { account, loading, error, subAccounts, thirdLevelAccounts, fetchAcct2, fetchAcct3 } = useAccount();
    const [expandedAccount, setExpandedAccount] = useState(null);
    const [expandedSubAccount, setExpandedSubAccount] = useState(null);

    // Estados para los modales
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showSubGroupModal, setShowSubGroupModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);

    // Estados para los formularios
    const [newGroup, setNewGroup] = useState({ grupo: '', nombregrupo: '' });
    const [newSubGroup, setNewSubGroup] = useState({ subgrupo: '', sgnom: '' });
    const [newAccount, setNewAccount] = useState({ cuentanum: '', cuentanom: '' });

    if (loading) {
        return <div>Cargando cuentas...</div>;
    }

    if (error) {
        return <div>Error al cargar las cuentas: {error}</div>;
    }

    const handleRowClick = async (accountId, grupo) => {
        if (!grupo) {
            console.error('Grupo no definido');
            return;
        }

        if (expandedAccount === accountId) {
            setExpandedAccount(null);
            setExpandedSubAccount(null);
        } else {
            setExpandedAccount(accountId);
            setExpandedSubAccount(null);
            await fetchAcct2(accountId, grupo);
        }
    };

    const handleSubRowClick = async (accountId, subGroupId) => {
        if (expandedSubAccount === subGroupId) {
            setExpandedSubAccount(null);
        } else {
            setExpandedSubAccount(subGroupId);
            await fetchAcct3(accountId, subGroupId);
        }
    };

    const handleAddGroup = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'cuenta'), newGroup);
            setNewGroup({ grupo: '', nombregrupo: '' });
            setShowGroupModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error al agregar grupo:', error);
        }
    };

    const handleAddSubGroup = async (e) => {
        e.preventDefault();
        try {
            const subGroupRef = collection(db, 'cuenta', selectedGroupId, 'subgrupo');
            await addDoc(subGroupRef, newSubGroup);
            setNewSubGroup({ subgrupo: '', sgnom: '' });
            setShowSubGroupModal(false);
            await fetchAcct2(selectedGroupId, account.find(acc => acc.id === selectedGroupId)?.grupo);
        } catch (error) {
            console.error('Error al agregar subgrupo:', error);
        }
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            const accountRef = collection(db, 'cuenta', selectedGroupId, 'subgrupo', selectedSubGroupId, 'cuentas');
            await addDoc(accountRef, newAccount);
            setNewAccount({ cuentanum: '', cuentanom: '' });
            setShowAccountModal(false);
            await fetchAcct3(selectedGroupId, selectedSubGroupId);
        } catch (error) {
            console.error('Error al agregar cuenta:', error);
        }
    };

    return (
        <div className="tab-content">
            <h2>Configuración Financiera</h2>
            <div className="config-section">
                <h3>Cuentas Contables</h3>
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Grupo</th>
                                <th>Nombre</th>
                                <th>
                                    <button onClick={() => setShowGroupModal(true)} className="add-button">
                                        Agregar Grupo
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {account && account.map(acct => (
                                <React.Fragment key={acct.id}>
                                    <tr 
                                        onClick={() => handleRowClick(acct.id, acct.grupo)}
                                        style={{ cursor: 'pointer' }}
                                        className={expandedAccount === acct.id ? 'expanded-row' : ''}
                                    >
                                        <td>{acct.grupo}</td>
                                        <td>{acct.nombregrupo}</td>
                                        <td></td>
                                    </tr>
                                    {expandedAccount === acct.id && (
                                        <tr>
                                            <td colSpan="3">
                                                <div className="expanded-content">
                                                    {subAccounts[acct.id] && subAccounts[acct.id].length > 0 ? (
                                                        <table className="users-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>SubGrupo</th>
                                                                    <th>Nombre</th>
                                                                    <th>
                                                                        <button 
                                                                            onClick={() => {
                                                                                setSelectedGroupId(acct.id);
                                                                                setShowSubGroupModal(true);
                                                                            }} 
                                                                            className="add-button"
                                                                        >
                                                                            Agregar Subgrupo
                                                                        </button>
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {subAccounts[acct.id].map(subAcct => (
                                                                    <React.Fragment key={subAcct.id}>
                                                                        <tr 
                                                                            onClick={() => handleSubRowClick(acct.id, subAcct.id)}
                                                                            style={{ cursor: 'pointer' }}
                                                                            className={expandedSubAccount === subAcct.id ? 'expanded-row' : ''}
                                                                        >
                                                                            <td>{subAcct.subgrupo}</td>
                                                                            <td>{subAcct.sgnom}</td>
                                                                            <td></td>
                                                                        </tr>
                                                                        {expandedSubAccount === subAcct.id && (
                                                                            <tr>
                                                                                <td colSpan="3">
                                                                                    <div className="expanded-content">
                                                                                        {thirdLevelAccounts[subAcct.id] && thirdLevelAccounts[subAcct.id].length > 0 ? (
                                                                                            <table className="users-table">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th>Número de Cuenta</th>
                                                                                                        <th>Nombre de Cuenta</th>
                                                                                                        <th>
                                                                                                            <button 
                                                                                                                onClick={() => {
                                                                                                                    setSelectedGroupId(acct.id);
                                                                                                                    setSelectedSubGroupId(subAcct.id);
                                                                                                                    setShowAccountModal(true);
                                                                                                                }} 
                                                                                                                className="add-button"
                                                                                                            >
                                                                                                                Agregar Cuenta
                                                                                                            </button>
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {thirdLevelAccounts[subAcct.id].map(account => (
                                                                                                        <tr key={account.id}>
                                                                                                            <td>{account.cuentanum}</td>
                                                                                                            <td>{account.cuentanom}</td>
                                                                                                            <td></td>
                                                                                                        </tr>
                                                                                                    ))}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        ) : (
                                                                                            <div className="empty-state">
                                                                                                <p>No hay cuentas disponibles</p>
                                                                                                <button 
                                                                                                    onClick={() => {
                                                                                                        setSelectedGroupId(acct.id);
                                                                                                        setSelectedSubGroupId(subAcct.id);
                                                                                                        setShowAccountModal(true);
                                                                                                    }} 
                                                                                                    className="add-button"
                                                                                                >
                                                                                                    Agregar Cuenta
                                                                                                </button>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <div className="empty-state">
                                                            <p>No hay sub-cuentas disponibles</p>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedGroupId(acct.id);
                                                                    setShowSubGroupModal(true);
                                                                }} 
                                                                className="add-button"
                                                            >
                                                                Agregar Subgrupo
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Agregar Grupo */}
            {showGroupModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Nuevo Grupo</h3>
                        <form onSubmit={handleAddGroup}>
                            <div className="form-group">
                                <label>Grupo:</label>
                                <input
                                    type="text"
                                    value={newGroup.grupo}
                                    onChange={(e) => setNewGroup({...newGroup, grupo: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre del Grupo:</label>
                                <input
                                    type="text"
                                    value={newGroup.nombregrupo}
                                    onChange={(e) => setNewGroup({...newGroup, nombregrupo: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="add-button">Guardar</button>
                                <button type="button" className="cancel-button" onClick={() => setShowGroupModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Agregar Subgrupo */}
            {showSubGroupModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Nuevo Subgrupo</h3>
                        <form onSubmit={handleAddSubGroup}>
                            <div className="form-group">
                                <label>Subgrupo:</label>
                                <input
                                    type="text"
                                    value={newSubGroup.subgrupo}
                                    onChange={(e) => setNewSubGroup({...newSubGroup, subgrupo: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre del Subgrupo:</label>
                                <input
                                    type="text"
                                    value={newSubGroup.sgnom}
                                    onChange={(e) => setNewSubGroup({...newSubGroup, sgnom: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="add-button">Guardar</button>
                                <button type="button" className="cancel-button" onClick={() => setShowSubGroupModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Agregar Cuenta */}
            {showAccountModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Nueva Cuenta</h3>
                        <form onSubmit={handleAddAccount}>
                            <div className="form-group">
                                <label>Número de Cuenta:</label>
                                <input
                                    type="text"
                                    value={newAccount.cuentanum}
                                    onChange={(e) => setNewAccount({...newAccount, cuentanum: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre de la Cuenta:</label>
                                <input
                                    type="text"
                                    value={newAccount.cuentanom}
                                    onChange={(e) => setNewAccount({...newAccount, cuentanom: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="add-button">Guardar</button>
                                <button type="button" className="cancel-button" onClick={() => setShowAccountModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}; 