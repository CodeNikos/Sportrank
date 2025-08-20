import React from 'react';
import './cards.css';

export function CardsContainer({ children }) {
    return <div className="cards-container">{children}</div>;
}

export function Card({ id, imageUrl, title, description, onClick }) {
    return (
        <div className="card" onClick={() => onClick(id)}>
            <div className="card-image">
                <img src={imageUrl} alt={title} />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
} 