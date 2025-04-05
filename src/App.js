import  React from 'react';
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Index } from './components/home/home';



export function App() {

  return (
    <BrowserRouter basename="/Sportrank">
      <Routes>
        <Route path="/" element={<Index />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
