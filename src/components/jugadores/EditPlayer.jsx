import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNotifications } from '../../hooks/useNotifications'
import './EditPlayer.css';

export function EditPlayer({ playerId, onClose, canEdit = true }) {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [certificadoImage, setCertificadoImage] = useState(null);
    const fileInputRef = useRef(null);
    const certificadoInputRef = useRef(null);
    const { notifications,  removeNotification, showWarning, showError } = useNotifications();

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const docRef = doc(db, "Players", playerId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('Datos del jugador cargados:', data);
                    console.log('fechaNacimiento original:', data.fechaNacimiento);
                    setFormData(data);
                }
            } catch (error) {
                console.error("Error al obtener jugador:", error);
            }
        };

        if (playerId) {
            fetchPlayer();
        }
    }, [playerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleCertificadoChange = (e) => {
        if (e.target.files[0]) {
            setCertificadoImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = { ...formData };

            if (image) {
                if (formData.playerpic) {
                    try {
                        const oldImageRef = ref(storage, formData.playerpic);
                        await deleteObject(oldImageRef);
                    } catch (error) {
                        console.log("Error al borrar imagen antigua:", error);
                    }
                }

                const storageRef = ref(storage, `ppics/${Date.now()}_${image.name}`);
                const uploadResult = await uploadBytes(storageRef, image);
                updateData.playerpic = await getDownloadURL(uploadResult.ref);
            }

            if (certificadoImage) {
                if (formData.certificadoUrl) {
                    try {
                        const oldCertRef = ref(storage, formData.certificadoUrl);
                        await deleteObject(oldCertRef);
                    } catch (error) {
                        console.log("Error al borrar certificado antiguo:", error);
                    }
                }

                const certificadoRef = ref(storage, `certi/${Date.now()}_${certificadoImage.name}`);
                const uploadResult = await uploadBytes(certificadoRef, certificadoImage);
                updateData.certificadoUrl = await getDownloadURL(uploadResult.ref);
            }

            await updateDoc(doc(db, "Players", playerId), updateData);
            alert('Jugador actualizado exitosamente');
            onClose();
        } catch (error) {
            console.error("Error al actualizar jugador:", error);
            alert('Error al actualizar jugador');
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <div>Cargando...</div>;

    // Función para formatear fecha para input type="date"
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        
        // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        
        // Intentar parsear la fecha
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn('Fecha inválida:', dateString);
            return '';
        }
        
        // Formatear a YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="edit-modal">
            <div className="edit-content">
                <div className="edit-header">
                    <h2>{canEdit ? 'Editar Jugador' : 'Detalle del Jugador'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={canEdit ? handleSubmit : (e) => e.preventDefault()} className="edit-form">
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cédula:</label>
                        <input
                            type="text"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Género:</label>
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        >
                            <option value="">Seleccione género</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formatDateForInput(formData.fechaNacimiento)}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nacionalidad:</label>
                        <input
                            type="text"
                            name="nacionalidad"
                            value={formData.nacionalidad}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Celular:</label>
                        <input
                            type="tel"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contacto de Emergencia:</label>
                        <input
                            type="text"
                            name="contactoEmergencia"
                            value={formData.contactoEmergencia}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Teléfono de Emergencia:</label>
                        <input
                            type="tel"
                            name="telefonoEmergencia"
                            value={formData.telefonoEmergencia}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alergias:</label>
                        <textarea
                            name="alergias"
                            value={formData.alergias}
                            onChange={handleChange}
                            disabled={!canEdit}
                        />
                    </div>

                    <div className="form-group">
                        <label>Condición Médica:</label>
                        <textarea
                            name="condicionMedica"
                            value={formData.condicionMedica}
                            onChange={handleChange}
                            disabled={!canEdit}
                        />
                    </div>

                    <div className="form-group">
                        <label>Certificación WFDF:</label>
                        <select
                            name="certificacionWFDF"
                            value={formData.certificacionWFDF}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        >
                            <option value="">Seleccione certificación</option>
                            <option value="standard">Standard</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Actualizar Certificado:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCertificadoChange}
                            ref={certificadoInputRef}
                            disabled={!canEdit}
                        />
                        {formData.certificadoUrl && (
                            <img 
                                src={formData.certificadoUrl} 
                                alt="Certificado actual" 
                                className="preview-image"
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label>Numero Jugador:</label>
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                            disabled={!canEdit}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Actualizar Foto:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            disabled={!canEdit}
                        />
                        {formData.playerpic && (
                            <img 
                                src={formData.playerpic} 
                                alt="Foto actual" 
                                className="preview-image"
                            />
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading || !canEdit}>
                            {canEdit ? (loading ? 'Actualizando...' : 'Actualizar') : 'Solo lectura'}
                        </button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 