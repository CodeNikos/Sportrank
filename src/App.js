import  React from 'react';
import './App.css'
import { Routes, Route, HashRouter } from "react-router-dom";
import { Index } from './components/home/home';
import { Jugador } from './components/jugadores/jugador';
import { Show } from './components/jugadores/mostrar';
import { Temp, Ingresos, Egresos, Balance } from './components/finanzas/fin'



export function App() {

  return (
    
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/players" element={<Show />} />
        <Route path="/add" element={<Jugador />} />
        <Route path="/temp" element={<Temp />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/egresos" element={<Egresos />} />
        <Route path="/balance" element={<Balance />} />
      </Routes>
      </HashRouter>

  );
}

export default App;
