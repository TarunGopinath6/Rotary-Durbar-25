import './App.css';
import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';

import RequireAuth from "./components/RequireAuth"
import ResponsiveAppBar from './components/Appbar';

import Login from './pages/Login';
import NotFoundPage from './pages/NotFoundPage';
import Downloads from './pages/Downloads';
import Home from './pages/Home';

export const AppContext = createContext();

function App() {

  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AppContext.Provider value={{ authenticated, setAuthenticated }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ResponsiveAppBar />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/home" element={<RequireAuth> <Home /> </RequireAuth>} />
              {/* <Route exact path="/downloads" element={<Downloads />} /> */}
              <Route exact path="*" element={<NotFoundPage />} />
            </Routes>
          </LocalizationProvider>
        </Router>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
