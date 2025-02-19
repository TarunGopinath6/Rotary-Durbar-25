import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './utils/theme'

import ResponsiveAppBar from './components/common/Appbar';
import Footer from "./components/common/Footer";

import ToS from "./pages/ToS";
import Privacy from "./pages/Privacy";
import NotFoundPage from './pages/NotFoundPage';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route exact path="/terms-of-service" element={<ToS />} />
          <Route exact path="/privacy-policy" element={<Privacy />} />
          <Route exact path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;