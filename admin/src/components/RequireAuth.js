import React, { useEffect, useState, useContext } from "react";
import supabase from "../API/supabase";
import { auth } from "../API/firebaseConfig"
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App"


const RequireAuth = ({ children }) => {

  const {authenticated, setAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async (user) => {
      if (user) {
        try {
          // Fetch user data from the 'members' table
          const { data: userDoc, error: errorUserDoc } = await supabase
            .from("members")
            .select("*")
            .eq("id", user.uid) // Replace 'id' with your primary key
            .single();

          if (errorUserDoc || !userDoc) {
            console.error(
              "Error fetching user data or user does not exist:",
              errorUserDoc
            );
            navigate("/login"); // Redirect to login page
          }

          setAuthenticated(true);
        } catch (error) {
          console.error("Unexpected error:", error);
          navigate("/login"); // Redirect to login page on unexpected error
        }
      } else {
        navigate("/login"); // Redirect to login page if no user is logged in
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkUserStatus(user);
    });

    return () => unsubscribe();
  }, []);


  if (authenticated) {
    return children;
  }

  // Otherwise, return null or a loading indicator while checking authentication
  return <div>Loading...</div>;
};

export default RequireAuth;
