import React, { useState } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './PlayerConfig.css';

export const PlayersConfig = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({ ok: 0, fail: 0, errors: [] });

    const knownHeaders = [
        'nombre',
        'apellido',
        'cedula',
        'genero',
        'fechanacimiento',
        'nacionalidad',
        'email',
        'celular',
        'contactoemergencia',
        'telefonoemergencia',
        'alergias',
        'condicionmedica',
        'numero'
    ];

    const downloadTemplate = () => {
        const header = [
            'nombre','apellido','cedula','genero','fechaNacimiento','nacionalidad','email','celular','contactoEmergencia','telefonoEmergencia','alergias','condicionMedica','numero'
        ].join(',');
        const sample = [
            'Juan','Pérez','12345678','masculino','2000-01-31','Venezuela','juan@example.com','69696969','María Pérez','60007666','NA','NA','1'
        ].map(v => `"${v}"`).join(',');
        const content = `${header}\n${sample}`;
        
        // Agregar BOM para UTF-8
        const BOM = '\uFEFF';
        const csvContent = BOM + content;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'plantilla_jugadores_carga.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setCsvFile(file);
    };

    const parseCsvLine = (line) => {
        const values = [];
        let current = '';
        let insideQuotes = false;
        for (let i = 0; i < line.length; i += 1) {
            const char = line[i];
            if (char === '"') {
                if (insideQuotes && line[i + 1] === '"') {
                    current += '"';
                    i += 1;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if ((char === ',' || char === ';') && !insideQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        return values.map(v => v.trim());
    };

    const normalizeHeader = (h) => h.replace(/^\ufeff/, '').trim().toLowerCase();

    const eliminarDiacriticos = (texto) => {
        if (!texto) return '';
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
            .replace(/[ñÑ]/g, 'ñ') // Reemplaza ñ por n
            .replace(/[áÁ]/g, 'a')
            .replace(/[éÉ]/g, 'e')
            .replace(/[íÍ]/g, 'i')
            .replace(/[óÓ]/g, 'o')
            .replace(/[úÚ]/g, 'u')
            .replace(/[üÜ]/g, 'u');
    };

    const loadCsv = async () => {
        if (!csvFile) {
            alert('Seleccione un archivo CSV');
            return;
        }
        setLoading(true);
        setResult({ ok: 0, fail: 0, errors: [] });

        try {
            // Leer el archivo como texto UTF-8
            const text = await csvFile.text();
            
            const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
            if (lines.length < 2) {
                throw new Error('El CSV no contiene datos');
            }

            const headerCells = parseCsvLine(lines[0]).map(normalizeHeader).map(eliminarDiacriticos);

            const headerIndex = {};
            headerCells.forEach((h, idx) => {
                headerIndex[h] = idx;
            });

            console.log('Headers encontrados:', headerCells);
            console.log('Header index:', headerIndex);

            const missingRequired = ['nombre','apellido','cedula'].filter(h => !(h in headerIndex));
            if (missingRequired.length > 0) {
                throw new Error(`Faltan columnas obligatorias: ${missingRequired.join(', ')}`);
            }

            const rows = lines.slice(1);
            let ok = 0;
            let fail = 0;
            const errors = [];

            for (let r = 0; r < rows.length; r += 1) {
                const raw = parseCsvLine(rows[r]);
                if (raw.every(c => c.trim() === '')) continue;

                const getVal = (key) => {
                    const normalizedKey = eliminarDiacriticos(key);
                    const idx = headerIndex[normalizedKey];
                    if (idx === undefined) return '';
                    const value = (raw[idx] || '').replace(/^\s*\"|\"\s*$/g, '').trim();
                    return value; // Preservar el valor original sin eliminar diacríticos
                };

                const docData = {
                    nombre: getVal('nombre'),
                    apellido: getVal('apellido'),
                    cedula: getVal('cedula'),
                    genero: getVal('genero'),
                    fechaNacimiento: getVal('fechanacimiento') || getVal('fechaNacimiento'),
                    nacionalidad: getVal('nacionalidad'),
                    email: getVal('email'),
                    celular: getVal('celular'),
                    contactoEmergencia: getVal('contactoemergencia') || getVal('contactoEmergencia'),
                    telefonoEmergencia: getVal('telefonoemergencia') || getVal('telefonoEmergencia'),
                    alergias: getVal('alergias'),
                    condicionMedica: getVal('condicionmedica') || getVal('condicionMedica'),
                    numero: getVal('numero')
                };

                try {
                    if (!docData.nombre || !docData.apellido || !docData.cedula) {
                        throw new Error('Campos obligatorios vacíos (nombre, apellido, cedula)');
                    }
                    await addDoc(collection(db, 'Players'), docData);
                    ok += 1;
                } catch (err) {
                    fail += 1;
                    errors.push(`Línea ${r + 2}: ${err.message || String(err)}`);
                }
            }

            setResult({ ok, fail, errors });
            alert(`Carga finalizada. Éxitos: ${ok}. Fallos: ${fail}.`);
        } catch (error) {
            setResult({ ok: 0, fail: 1, errors: [error.message || String(error)] });
            alert(`Error al procesar CSV: ${error.message || String(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content">
            <h2>Configuración de Jugadores</h2>

            <div className="config-section" style={{ marginTop: 24 }}>
                <h3>Carga masiva de jugadores (CSV)</h3>
                <div className="config-form">
                    <div className="form-group">
                        <button 
                            type="button" 
                            onClick={downloadTemplate}
                            className="btn-small btn-secondary"
                            style={{ marginRight: '10px' }}
                        >
                            Descargar plantilla CSV
                        </button>
                    </div>
                    <div className="form-group">
                        <label>Archivo CSV</label>
                        <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
                    </div>
                    <button 
                        type="button" 
                        onClick={loadCsv} 
                        disabled={loading || !csvFile}
                        className="btn-small btn-primary"
                    >
                        {loading ? 'Cargando...' : 'Cargar CSV'}
                    </button>
                    {(result.ok > 0 || result.fail > 0) && (
                        <div style={{ marginTop: 12 }}>
                            <div><strong>Resultados:</strong> Éxitos: {result.ok} | Fallos: {result.fail}</div>
                            {result.errors.length > 0 && (
                                <ul>
                                    {result.errors.map((e, i) => (
                                        <li key={i}>{e}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                        Columnas soportadas: {knownHeaders.join(', ')}
                    </div>
                </div>
            </div>
        </div>
    );
}; 