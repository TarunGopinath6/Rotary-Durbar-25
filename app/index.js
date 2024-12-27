import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions 
} from "react-native";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import supabase from "@/supabase.js";
// import { StatusBar } from "react-native";

export default function Index() {

  const { width } = Dimensions.get('window');


  useEffect(() => {
    const checkUserStatus = async (user) => {
      if (user) {
        try {
          // Fetch the user data from the 'members' table using the user's ID
          const { data: userDoc, error: errorUserDoc } = await supabase
            .from("members")
            .select("*")
            .eq("id", user.uid) // Replace 'id' with your primary key in the 'members' table
            .single();

          const { data: headerDoc, error: errorHeaderDoc } = await supabase
            .from("internal")
            .select("*")
            .eq("active", true)
            .single();

          if (errorUserDoc || errorHeaderDoc || !userDoc) {
            console.error(
              "Error fetching user data or user does not exist:",
              error
            );
            router.replace("/login"); // Redirect to home if user does not exist
          } else {
            //setUserData({ id: userDoc.id, ...userDoc });
            //setHeaderData(headerDoc);
            router.replace('/protected/(tabs)')
          }
        } catch (error) {
          console.error("Unexpected error:", error);
          router.replace("/login"); // Redirect to home if an unexpected error occurs
        }
      } else {
        router.replace("/login"); // Redirect to home if no user is logged in
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkUserStatus(user);
    });

    return unsubscribe;
  }, [router]);


  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={[styles.image, { width: width * 0.5 }]} 
        resizeMode="contain"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a32638', // Change to your preferred background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 'auto', // Let the height adjust automatically
    aspectRatio: 1, // Maintain the aspect ratio of the image
  },
});
