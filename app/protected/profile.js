import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "@/firebaseConfig";


export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({})

    const router = useRouter();
  

  useEffect(() => {

    const checkUserStatus = async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid); // Get the user document from Firestore
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            router.replace("/");
          }
          else {
            setUserData({id: userDoc.id, ...userDoc.data()})
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.replace("/");
        }
      } else {
        router.replace("/");
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkUserStatus(user); // Call the async function to check user status
    });

    return unsubscribe;

  }, [router]);


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Profile</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Profile</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(userData).map(([key, value]) => (
          <View key={key} style={styles.infoRow}>
            <Text style={styles.infoKey}>{key}:</Text>
            <Text>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    flex: 1,
    padding: 16
  },
  heading: {
    fontSize: 24, // Adjust size for different levels of headings
    fontWeight: 'bold', // Make it bold to distinguish as a heading
    color: '#333', // Choose your desired color
    textAlign: 'center', // Optional: Center align text
    marginBottom: 16, // Optional: Add some spacing below the heading
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoKey: {
    fontWeight: "bold",
    marginRight: 5,
  },
});
