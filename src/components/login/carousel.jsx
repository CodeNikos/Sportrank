import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { storage } from '../../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import './ImageCarousel.css';

export function ImageCarousel() {
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const carouselRef = ref(storage, 'carousel/');
                const result = await listAll(carouselRef);
                
                if (result.items.length === 0) {
                    console.log('No se encontraron imágenes en la carpeta carousel');
                    setLoading(false);
                    return;
                }

                const urls = await Promise.all(
                    result.items.map(async (item) => {
                        try {
                            return await getDownloadURL(item);
                        } catch (error) {
                            console.error(`Error al obtener URL de ${item.name}:`, error);
                            return null;
                        }
                    })
                );

                const validUrls = urls.filter(url => url !== null);
                setImageUrls(validUrls);
                setLoading(false);
                
            } catch (error) {
                console.error('Error al acceder a la carpeta carousel:', error);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return <div>Cargando imágenes...</div>;
    }

    if (imageUrls.length === 0) {
        return null;
    }

    return (
        <Carousel 
            className='carousel' 
            autoPlay={true} 
            interval={3000} 
            showThumbs={false} 
            infiniteLoop={true} 
            showStatus={false}
        >
            {imageUrls.map((url, index) => (
                <div key={index}>
                    <img src={url} alt={`Carousel image ${index + 1}`} />
                </div>
            ))}
        </Carousel>
    );
}