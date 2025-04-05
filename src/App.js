import  React from 'react';
import './App.css'
import { Routes, Route, BrowserRouter, HashRouter } from "react-router-dom";
import { Index } from './components/home/home';



export function App() {

  return (
    <BrowserRouter>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />

      </Routes>
      </HashRouter>
    </BrowserRouter>
  );
}

export default App;
