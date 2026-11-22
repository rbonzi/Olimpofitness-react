import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Planes from './pages/Planes';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Reservas from './pages/Reserva';
import Nosotros from './pages/Nosotros';
import Faq from './pages/Faq';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path='/reservas' element={<Reservas/>} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>
    </Router>
  );
}