import React from 'react';
import { Sidebar } from '../rss/Sidebar';
import { PlayerForm } from "../form/PlayerForm";

export function Jugador(){


    return (
        <div className="home-wrapper">
            <Sidebar />
            <div className="body-container">
            <div className="vertical">
                <div className='horizontal'>
            </div>
                <PlayerForm />
            </div>
            </div>
        </div>

    );
}