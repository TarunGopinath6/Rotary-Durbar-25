import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "@/firebaseConfig";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

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
          } else {
            setUserData({ id: userDoc.id, ...userDoc.data() });
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/mysore_palace.png")}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.listContainer}>
        {/* <FlatList
          data={support}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          contentContainerStyle={{ paddingBottom: 20 }}
        />*/}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "#A32638",
    paddingBottom: 20,
    paddingTop: 0,
    position: "relative",
    height: 120,
    justifyContent: "center",
    zIndex: 0,
  },
  headerImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    resizeMode: "cover",
    opacity: 0.28,
  },
  headerText: {
    fontSize: 26,
    padding: 10,
    paddingHorizontal: 20,
    color: "#FFBD1B",
    fontFamily: "Inter_500Medium",
  },
});
