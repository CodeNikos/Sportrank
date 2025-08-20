import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

// Hook para manejar el estado de carga y errores
const useLoadingState = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleError = (error) => {
        console.error('Error:', error);
        setError(error.message);
        toast.error('Error en la operación');
    };

    return { loading, setLoading, error, setError, handleError };
};

// Hook para manejar las cuentas principales
const useMainAccounts = (loadingState) => {
    const [accounts, setAccounts] = useState([]);
    const { setLoading, handleError } = loadingState;

    const fetchMainAccounts = async () => {
        try {
            setLoading(true);
            const accountsRef = collection(db, 'cuenta');
            const q = query(accountsRef, orderBy('grupo', 'asc'));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setAccounts([]);
                return;
            }

            const accountsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setAccounts(accountsList);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return { accounts, fetchMainAccounts };
};

// Hook para manejar las sub-cuentas
const useSubAccounts = (loadingState) => {
    const [subAccounts, setSubAccounts] = useState({});
    const { handleError } = loadingState;

    const fetchSubAccounts = async (accountId, grupo) => {
        try {
            if (!grupo) {
                throw new Error('Grupo no definido');
            }

            const subAccountsRef = collection(db, 'cuenta', accountId, 'subgrupo');
            const q = query(
                subAccountsRef,
                orderBy('subgrupo', 'asc')
            );
            const subAccountsSnapshot = await getDocs(q);
            
            if (subAccountsSnapshot.empty) {
                setSubAccounts(prev => ({
                    ...prev,
                    [accountId]: []
                }));
                return;
            }

            const subAccountsList = subAccountsSnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .sort((a, b) => a.subgrupo.localeCompare(b.subgrupo));

            setSubAccounts(prev => ({
                ...prev,
                [accountId]: subAccountsList
            }));

        } catch (error) {
            handleError(error);
        }
    };

    return { subAccounts, fetchSubAccounts };
};

// Hook para manejar las cuentas del tercer nivel
const useAccounts = (loadingState) => {
    const [accounts, setAccounts] = useState({});
    const { handleError } = loadingState;

    const fetchAccounts = async (accountId, subGroupId) => {
        try {
            console.log('Fetching accounts for:', { accountId, subGroupId });
            
            const accountsRef = collection(db, 'cuenta', accountId, 'subgrupo', subGroupId, 'cuentas');
            console.log('Collection path:', accountsRef.path);
            
            const q = query(
                accountsRef,
                orderBy('cuentanum', 'asc')
            );
            const accountsSnapshot = await getDocs(q);
            
            console.log('Accounts snapshot:', accountsSnapshot.empty ? 'empty' : 'has data');
            console.log('Number of documents:', accountsSnapshot.size);
            
            if (accountsSnapshot.empty) {
                console.log('No accounts found');
                setAccounts(prev => ({
                    ...prev,
                    [subGroupId]: []
                }));
                return;
            }

            const accountsList = accountsSnapshot.docs.map(doc => {
                const data = doc.data();
                console.log('Account data:', { id: doc.id, ...data });
                return {
                    id: doc.id,
                    ...data
                };
            });

            console.log('Processed accounts list:', accountsList);

            setAccounts(prev => {
                const newState = {
                    ...prev,
                    [subGroupId]: accountsList
                };
                return newState;
            });

        } catch (error) {
            console.error('Error fetching accounts:', error);
            handleError(error);
        }
    };

    return { accounts, fetchAccounts };
};

// Hook para manejar las subcuentas de una cuenta específica
const useAccountSubAccounts = (loadingState) => {
    const [accountSubAccounts, setAccountSubAccounts] = useState({});
    const { handleError } = loadingState;

    const fetchAccountSubAccounts = async (accountId, subGroupId, groupId) => {
        try {
            const subAccountsRef = collection(db, 'cuenta', accountId, 'subgrupo', subGroupId, 'cuentas', groupId, 'subcuenta');
            
            const q = query(
                subAccountsRef,
                orderBy('subcuenta', 'asc')
            );
            const subAccountsSnapshot = await getDocs(q);
            
            if (subAccountsSnapshot.empty) {
                setAccountSubAccounts(prev => ({
                    ...prev,
                    [groupId]: []
                }));
                return;
            }

            const subAccountsList = subAccountsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAccountSubAccounts(prev => ({
                ...prev,
                [groupId]: subAccountsList
            }));

        } catch (error) {
            console.error('Error fetching subaccounts:', error);
            handleError(error);
        }
    };

    return { accountSubAccounts, fetchAccountSubAccounts };
};

// Hook principal que combina los hooks específicos
export const useAccount = () => {
    const loadingState = useLoadingState();
    const { accounts, fetchMainAccounts } = useMainAccounts(loadingState);
    const { subAccounts, fetchSubAccounts } = useSubAccounts(loadingState);
    const { accounts: thirdLevelAccounts, fetchAccounts } = useAccounts(loadingState);
    const { accountSubAccounts, fetchAccountSubAccounts } = useAccountSubAccounts(loadingState);

    useEffect(() => {
        fetchMainAccounts();
    }, []);

    return {
        account: accounts,
        loading: loadingState.loading,
        error: loadingState.error,
        subAccounts,
        fetchAcct2: fetchSubAccounts,
        thirdLevelAccounts,
        fetchAcct3: fetchAccounts,
        accountSubAccounts,
        fetchAccountSubAccounts
    };
};

