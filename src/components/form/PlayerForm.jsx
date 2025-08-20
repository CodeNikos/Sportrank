import React, { useState, useRef } from 'react';
import { db, storage } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './PlayerForm.css';

export function PlayerForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        genero: '',
        fechaNacimiento: '',
        nacionalidad: '',
        email: '',
        celular: '',
        contactoEmergencia: '',
        telefonoEmergencia: '',
        alergias: '',
        condicionMedica: '',
        certificacionWFDF: '',
    });
    const [image, setImage] = useState(null);
    const [certificadoImage, setCertificadoImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const certificadoInputRef = useRef(null);

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
            let imageUrl = '';
            let certificadoUrl = '';
            
            if (image) {
                const storageRef = ref(storage, `ppics/${Date.now()}_${image.name}`);
                const uploadResult = await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            if (certificadoImage) {
                const certificadoRef = ref(storage, `certi/${Date.now()}_${certificadoImage.name}`);
                await uploadBytes(certificadoRef, certificadoImage);
                certificadoUrl = await getDownloadURL(certificadoRef);
            }

            await addDoc(collection(db, "Players"), {
                nombre: formData.nombre,
                apellido: formData.apellido,
                cedula: formData.cedula,
                genero: formData.genero,
                fechaNacimiento: formData.fechaNacimiento,
                nacionalidad: formData.nacionalidad,
                email: formData.email,
                celular: formData.celular,
                contactoEmergencia: formData.contactoEmergencia,
                telefonoEmergencia: formData.telefonoEmergencia,
                alergias: formData.alergias,
                condicionMedica: formData.condicionMedica,
                certificacionWFDF: formData.certificacionWFDF,
                playerpic: imageUrl,
                certificadoUrl: certificadoUrl
            });

            setFormData({
                nombre: '',
                apellido: '',
                cedula: '',
                genero: '',
                fechaNacimiento: '',
                nacionalidad: '',
                email: '',
                celular: '',
                contactoEmergencia: '',
                telefonoEmergencia: '',
                alergias: '',
                condicionMedica: '',
                certificacionWFDF: '',
            });
            setImage(null);
            setCertificadoImage(null);
            fileInputRef.current.value = '';
            certificadoInputRef.current.value = '';
            alert('Jugador agregado exitosamente');

        } catch (error) {
            console.error("Error al agregar jugador:", error);
            alert('Error al agregar jugador');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Agregar Nuevo Jugador</h2>
            <form onSubmit={handleSubmit} className="player-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
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
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Género:</label>
                    <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
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
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
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
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Alergias:</label>
                    <textarea
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleChange}
                        placeholder="Ingrese alergias o escriba 'ninguna'"
                    />
                </div>

                <div className="form-group">
                    <label>Condición Médica:</label>
                    <textarea
                        name="condicionMedica"
                        value={formData.condicionMedica}
                        onChange={handleChange}
                        placeholder="Ingrese condiciones médicas o escriba 'ninguna'"
                    />
                </div>

                <div className="form-group">
                    <label>Certificación WFDF:</label>
                    <select
                        name="certificacionWFDF"
                        value={formData.certificacionWFDF}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione certificación</option>
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Certificado (foto):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleCertificadoChange}
                        ref={certificadoInputRef}
                    />
                </div>

                <div className="form-group">
                    <label>Foto del Jugador:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Agregando...' : 'Agregar Jugador'}
                </button>
            </form>
        </div>
    );
} 