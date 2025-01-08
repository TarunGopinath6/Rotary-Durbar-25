import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import RequireAuth from "./components/RequireAuth"

import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Downloads from './pages/Downloads';
import Home from './pages/Home';



function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/home" element={<RequireAuth> <Home /> </RequireAuth>} />
          <Route exact path="/downloads" element={<Downloads />} />
          <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
