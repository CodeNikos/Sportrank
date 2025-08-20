import React, { useState } from 'react';
import { useAccount } from '../../../hooks/useAccount';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './FinanceConfig.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="confirm-buttons">
                    <button onClick={onConfirm} className="confirm-button">
                        Confirmar
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FinanceConfig = () => {
    const { account, loading, error, subAccounts, thirdLevelAccounts, accountSubAccounts, fetchAcct2, fetchAcct3, fetchAccountSubAccounts } = useAccount();
    const [expandedAccount, setExpandedAccount] = useState(null);
    const [expandedSubAccount, setExpandedSubAccount] = useState(null);
    const [expandedAccountSubAccount, setExpandedAccountSubAccount] = useState(null);

    // Estados para los modales
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showSubGroupModal, setShowSubGroupModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showAccountSubAccountModal, setShowAccountSubAccountModal] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedSubGroupId, setSelectedSubGroupId] = useState(null);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    // Estados para los formularios
    const [newGroup, setNewGroup] = useState({ grupo: '', nombregrupo: '' });
    const [newSubGroup, setNewSubGroup] = useState({ subgrupo: '', sgnom: '' });
    const [newAccount, setNewAccount] = useState({ cuentanum: '', cuentanom: '' });
    const [newAccountSubAccount, setNewAccountSubAccount] = useState({ subcuenta: '', subcuentanom: '' });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState({ title: '', message: '' });

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

    const handleAccountSubAccountClick = async (accountId, subGroupId, groupId) => {
        try {
            if (expandedAccountSubAccount === groupId) {
                setExpandedAccountSubAccount(null);
            } else {
                setExpandedAccountSubAccount(groupId);
                await fetchAccountSubAccounts(accountId, subGroupId, groupId);
            }
        } catch (error) {
            console.error('Error al manejar clic en cuenta:', error);
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

    const handleAddAccountSubAccount = async (e) => {
        e.preventDefault();
        try {
            console.log('Adding subaccount with data:', {
                groupId: selectedGroupId,
                subGroupId: selectedSubGroupId,
                acctsId: selectedAccountId,
                subAccount: newAccountSubAccount
            });

            // Obtenemos la referencia a la subcolección subcuenta
            const subAccountRef = collection(db, 'cuenta', selectedGroupId, 'subgrupo', selectedSubGroupId, 'cuentas', selectedAccountId, 'subcuenta');
            
            await addDoc(subAccountRef, newAccountSubAccount);
            
            setNewAccountSubAccount({ subcuenta: '', subcuentanom: '' });
            setShowAccountSubAccountModal(false);
            
            // Actualizar la lista de subcuentas
            await fetchAccountSubAccounts(selectedGroupId, selectedSubGroupId, selectedAccountId);
        } catch (error) {
            console.error('Error al agregar subcuenta:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (confirmAction) {
            await confirmAction();
            setShowConfirmModal(false);
            setConfirmAction(null);
        }
    };

    const showConfirmDelete = (action, title, message) => {
        setConfirmAction(() => action);
        setConfirmMessage({ title, message });
        setShowConfirmModal(true);
    };

    const handleDeleteGroup = async (e, accountId) => {
        e.stopPropagation();
        showConfirmDelete(
            async () => {
                try {
                    const groupRef = doc(db, 'cuenta', accountId);
                    await deleteDoc(groupRef);
                    window.location.reload();
                } catch (error) {
                    console.error('Error al eliminar grupo:', error);
                }
            },
            'Eliminar Grupo',
            '¿Estás seguro de que deseas eliminar este grupo? Esta acción eliminará también todos los subgrupos y cuentas asociadas.'
        );
    };

    const handleDeleteSubGroup = async (e, accountId, subGroupId) => {
        e.stopPropagation();
        showConfirmDelete(
            async () => {
                try {
                    const subGroupRef = doc(db, 'cuenta', accountId, 'subgrupo', subGroupId);
                    await deleteDoc(subGroupRef);
                    await fetchAcct2(accountId, account.find(acc => acc.id === accountId)?.grupo);
                } catch (error) {
                    console.error('Error al eliminar subgrupo:', error);
                }
            },
            'Eliminar Subgrupo',
            '¿Estás seguro de que deseas eliminar este subgrupo? Esta acción eliminará también todas las cuentas asociadas.'
        );
    };

    const handleDeleteAccount = async (e, accountId, subGroupId, groupId) => {
        e.stopPropagation();
        showConfirmDelete(
            async () => {
                try {
                    const accountRef = doc(db, 'cuenta', accountId, 'subgrupo', subGroupId, 'cuentas', groupId);
                    await deleteDoc(accountRef);
                    await fetchAcct3(accountId, subGroupId);
                } catch (error) {
                    console.error('Error al eliminar cuenta:', error);
                }
            },
            'Eliminar Cuenta',
            '¿Estás seguro de que deseas eliminar esta cuenta? Esta acción eliminará también todas las subcuentas asociadas.'
        );
    };

    const handleDeleteSubAccount = async (e, accountId, subGroupId, groupId, subAccountId) => {
        e.stopPropagation();
        showConfirmDelete(
            async () => {
                try {
                    const subAccountRef = doc(db, 'cuenta', accountId, 'subgrupo', subGroupId, 'cuentas', groupId, 'subcuenta', subAccountId);
                    await deleteDoc(subAccountRef);
                    await fetchAccountSubAccounts(accountId, subGroupId, groupId);
                } catch (error) {
                    console.error('Error al eliminar subcuenta:', error);
                }
            },
            'Eliminar Subcuenta',
            '¿Estás seguro de que deseas eliminar esta subcuenta?'
        );
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
                                                                            <td>
                                                                                <button 
                                                                                    onClick={(e) => handleDeleteSubGroup(e, acct.id, subAcct.id)}
                                                                                    className="delete-button"
                                                                                >
                                                                                    Eliminar
                                                                                </button>
                                                                            </td>
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
                                                                                                        <th>Acciones</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {thirdLevelAccounts[subAcct.id].map(account => (
                                                                                                        <React.Fragment key={account.id}>
                                                                                                            <tr 
                                                                                                                onClick={() => {
                                                                                                                    handleAccountSubAccountClick(acct.id, subAcct.id, account.id);
                                                                                                                }}
                                                                                                                style={{ cursor: 'pointer' }}
                                                                                                                className={expandedAccountSubAccount === account.id ? 'expanded-row' : ''}
                                                                                                            >
                                                                                                                <td>{account.cuentanum}</td>
                                                                                                                <td>{account.cuentanom}</td>
                                                                                                                <td>
                                                                                                                    <button 
                                                                                                                        onClick={(e) => handleDeleteAccount(e, acct.id, subAcct.id, account.id)}
                                                                                                                        className="delete-button"
                                                                                                                    >
                                                                                                                        Eliminar
                                                                                                                    </button>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            {expandedAccountSubAccount === account.id && (
                                                                                                                <tr>
                                                                                                                    <td colSpan="3">
                                                                                                                        <div className="expanded-content">
                                                                                                                            {accountSubAccounts[account.id] && accountSubAccounts[account.id].length > 0 ? (
                                                                                                                                <table className="users-table">
                                                                                                                                    <thead>
                                                                                                                                        <tr>
                                                                                                                                            <th>Subcuenta</th>
                                                                                                                                            <th>Nombre</th>
                                                                                                                                            <th>Acciones</th>
                                                                                                                                        </tr>
                                                                                                                                    </thead>
                                                                                                                                    <tbody>
                                                                                                                                        {accountSubAccounts[account.id].map(subAccount => (
                                                                                                                                            <tr key={subAccount.id}>
                                                                                                                                                <td>{subAccount.subcuenta}</td>
                                                                                                                                                <td>{subAccount.subcuentanom}</td>
                                                                                                                                                <td>
                                                                                                                                                    <button 
                                                                                                                                                        onClick={(e) => handleDeleteSubAccount(e, acct.id, subAcct.id, account.id, subAccount.id)}
                                                                                                                                                        className="delete-button"
                                                                                                                                                    >
                                                                                                                                                        Eliminar
                                                                                                                                                    </button>
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                        ))}
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            ) : (
                                                                                                                                <div className="empty-state">
                                                                                                                                    <p>No hay subcuentas disponibles</p>
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

            {/* Modal para Agregar Subcuenta de Cuenta */}
            {showAccountSubAccountModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Agregar Nueva Subcuenta</h3>
                        <form onSubmit={handleAddAccountSubAccount}>
                            <div className="form-group">
                                <label>Subcuenta:</label>
                                <input
                                    type="text"
                                    value={newAccountSubAccount.subcuenta}
                                    onChange={(e) => setNewAccountSubAccount({...newAccountSubAccount, subcuenta: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nombre de la Subcuenta:</label>
                                <input
                                    type="text"
                                    value={newAccountSubAccount.subcuentanom}
                                    onChange={(e) => setNewAccountSubAccount({...newAccountSubAccount, subcuentanom: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="add-button">Guardar</button>
                                <button type="button" className="cancel-button" onClick={() => setShowAccountSubAccountModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title={confirmMessage.title}
                message={confirmMessage.message}
            />
        </div>
    );
}; 