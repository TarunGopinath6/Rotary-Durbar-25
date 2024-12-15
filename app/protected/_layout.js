import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { auth, db } from "@/firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";


export default function ProtectedLayout() {
  const router = useRouter();

  useEffect(() => {

    const checkUserStatus = async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid); // Get the user document from Firestore
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            router.replace("/");
          } 
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.replace("/");
        }
      } else {
        router.replace("/");
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkUserStatus(user); // Call the async function to check user status
    });

    return unsubscribe;
    
  }, [router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Data Models' }} />
      <Stack.Screen name="itinerary" options={{ title: 'Itinerary' }} />
      <Stack.Screen name="members" options={{ title: 'Members' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="support" options={{ title: 'Support Users' }} />
    </Stack>
  );
}
