import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export const iniciarSesion = async (email, password) => {
    try {
        // Verificar si el usuario existe en la colección users
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error('Usuario no encontrado');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Verificar el estado del usuario
        if (userData.estado !== "A") {
            throw new Error('PENDIENTE_APROBACION');
        }

        // Si el estado es "A", proceder con el inicio de sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
};

export const cerrarSesion = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
    }
};

export const obtenerUsuarioActual = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, 
            (user) => {
                unsubscribe();
                resolve(user);
            },
            (error) => {
                unsubscribe();
                reject(error);
            }
        );
    });
};