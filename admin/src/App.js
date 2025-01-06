import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <Router>
       <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="*" element={<NotFoundPage />} />
      </Routes>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
