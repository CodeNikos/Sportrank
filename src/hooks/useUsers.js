import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export const useUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            toast.error('Error al cargar la lista de usuarios');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                rol: newRole
            });
            setUsers(users.map(user => 
                user.id === userId ? { ...user, rol: newRole } : user
            ));
            toast.success('Rol actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
            toast.error('Error al actualizar el rol');
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                estado: newStatus
            });
            setUsers(users.map(user => 
                user.id === userId ? { ...user, estado: newStatus } : user
            ));
            toast.success('Estado actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
            toast.error('Error al actualizar el estado');
        }
    };

    return {
        users,
        handleRoleChange,
        handleStatusChange
    };
}; 