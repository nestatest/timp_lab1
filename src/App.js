import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/add" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;