'use client'
import React, { useState, useEffect } from 'react';
import { getStyles, applyArtEffect, getSubmissionStatus } from '@/models/api-use';

//style
import '../../styles/index.css'

const ArtEffects = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [artStyles, setArtStyles] = useState([]);
    const [selectedArtStyle, setSelectedArtStyle] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submissionId, setSubmissionId] = useState(null);

    useEffect(() => {
        fetchArtStyles();
    }, []);

    const fetchArtStyles = async () => {
        try {
            const response = await getStyles();
            setArtStyles(response.data.styles);
            setSelectedArtStyle(response.data.styles[0].id);
        } catch (error) {
            console.error("Error al traer los datos de estilos artísticos: ", error );
        }
    }

    const handleFileChange = (element) => {
        const file = element.target.files[0];
        setSelectedFile(file);
        setUploadedImage(null);
        setSubmissionId(null);
    }

    const handleStyleChange = (element) => {
        setSelectedArtStyle(element.target.value);
    }

    const applyEffect = async () => {
        if (!selectedFile || !selectedArtStyle) return;

        setLoading(true);
        try{
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const imageBase64Encoded = fileReader.result.split(',')[1];
                console.log('Image Base64: ', imageBase64Encoded);
                const response = await applyArtEffect(selectedArtStyle, imageBase64Encoded, 512, null, false, false);
                console.log('Response: ', response.data);
                setSubmissionId(response.data.submissionId);
            }
            fileReader.readAsDataURL(selectedFile);
        } catch (error){
            console.error('Error aplicando efecto artístico: ', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const checkStatus = async () => {
            if (!submissionId) return;

            try {
                const response = await getSubmissionStatus(submissionId);
                if (response.data.status === 'finished') {
                    setUploadedImage(response.data.url);
                    setLoading(false);
                    setSubmissionId(null);
                } else if (response.data.status === 'error'){
                    console.error('Error procesando imagen: ', response.data.message );
                    setLoading(false);
                    setSubmissionId(null);
                } else {
                    setTimeout(checkStatus, 3000);
                }
            } catch (error) {
                console.error('Error chequeando el estado de la submisión: ', error);
                setLoading(false);
                setSubmissionId(null);
            }
        }

        checkStatus();
    }, [submissionId]);


    return (
        <div className='art-effects-container'>
            <h2>Aplica efecto artírtico a </h2>
            <h2 className='base-title'>tus fotos usando esta IA </h2>
            <input type='file' onChange={handleFileChange} />
            <div className='image-container'>

            </div>
            <br/>
            <select value={selectedArtStyle} onChange={handleStyleChange} >
                {artStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                        {style.title}
                    </option>
                ))}
            </select>
            <br/>
            <button onClick={applyEffect}>Aplica Efecto Artístico</button>
            {loading && <p className='loading-text'>Loading...</p>}
            <p>Solo disponible hasta el 31 de Agosto</p>
            <div className='image-container'>
                {uploadedImage && <img className='uploaded-image' src={uploadedImage} alt='Subida con efecto artístico' />}
                {/* TODO: Agregar botón de "descargar imagen" */}
            </div>
        </div>
    );
}

export default ArtEffects;
