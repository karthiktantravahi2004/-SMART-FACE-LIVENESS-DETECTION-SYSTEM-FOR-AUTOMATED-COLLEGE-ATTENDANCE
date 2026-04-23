import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Demo from './pages/Demo';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Records from './pages/Records';
import Navbar from './components/Navbar'; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/records" element={<Records />} />
      </Routes>
    </BrowserRouter>
  );
}