import React from 'react';
import './cards.css';

export function CardsContainer({ children }) {
    return <div className="cards-container">{children}</div>;
}

export function Card({ id, imageUrl, title, description, onClick }) {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Card clicked in component:', id);
        onClick(id);
    };

    return (
        <button 
            className="card" 
            onClick={handleClick} 
            style={{ 
                cursor: 'pointer', 
                userSelect: 'none', 
                position: 'relative',
                border: 'none',
                background: 'none',
                padding: 0,
                width: '100%',
                textAlign: 'left'
            }}
        >
            <div className="card-image">
                <img src={imageUrl} alt={title} />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </button>
    );
} 