import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/rss/Sidebar';
import Home from './components/Home';
import Add from './components/Add';
import Players from './components/Players';
import Temp from './components/Temp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/players" element={<Players />} />
            <Route path="/temp" element={<Temp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 