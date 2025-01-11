import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../API/firebaseConfig"
import supabase from "../API/supabase";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(80);

  useEffect(() => {
    const appBar = document.getElementById("appbar");
    if (appBar) {
      setHeaderHeight(appBar.getBoundingClientRect().height);
    }
  }, []);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleLogin = async () => {
    if (!email || !password) {
      alert("Error: Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Error: Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Set timeout for long response times
    const timeout = setTimeout(() => {
      setLoading(false);
      alert(
        "Timeout: The authentication process is taking too long. Please try again."
      );
    }, 30000); // 30 seconds

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);

      const { data: userDoc, error: errorUserDoc } = await supabase
        .from("members")
        .select("*")
        .eq("id", userCredential.user.uid) // Replace 'id' with your primary key in the 'members' table
        .maybeSingle();

      if (errorUserDoc)
        throw errorUserDoc;

      if (userDoc) {
        navigate('/home');
      } else {
        alert("Error: User is inactive or disabled.");
      }

      clearTimeout(timeout); // Clear timeout if request completes in time
    } catch (error) {
      console.error("Login error:", error.message);
      let errorMessage = "An error occurred. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      alert("Login Error: " + errorMessage);
    } finally {
      clearTimeout(timeout); // Ensure timeout is cleared
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm" sx={{ height: `calc(100vh - ${headerHeight}px)`, display: "flex", alignItems: "center", justifyContent: "center" }} >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box component="form" width="100%">
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
          {loading === true && "Loading..."}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
