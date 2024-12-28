// import { Tabs, useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Stack } from "expo-router";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import { auth, db } from "@/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// export default function ProtectedLayout() {
//   const router = useRouter();
//   const Tab = createBottomTabNavigator();

//   useEffect(() => {
//     const checkUserStatus = async (user) => {
//       if (user) {
//         try {
//           const userRef = doc(db, "users", user.uid); // Get the user document from Firestore
//           const userDoc = await getDoc(userRef);

//           if (!userDoc.exists()) {
//             router.replace("/");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           router.replace("/");
//         }
//       } else {
//         router.replace("/");
//       }
//     };

//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       checkUserStatus(user); // Call the async function to check user status
//     });

//     return unsubscribe;
//   }, [router]);

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Tab.Navigator>
//         <Tab.Screen name="index" options={{ title: "Data Models" }} />
//         <Tab.Screen name="itinerary" options={{ title: "Itinerary" }} />
//         <Tab.Screen name="members" options={{ title: "Members" }} />
//         <Tab.Screen name="profile" options={{ title: "Profile" }} />
//         <Tab.Screen name="support" options={{ title: "Support Users" }} />
//         <Tab.Screen name="signin" options={{ title: "Sign In" }} />
//       </Tab.Navigator>
//     </Tabs>
//   );
// }

// import { Tabs, useRouter, useSegments } from "expo-router";
// import { useEffect } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { auth, db } from "@/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { useWindowDimensions, Platform, View, StyleSheet } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "react-native";

// export default function ProtectedLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const { width } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   // Calculate bottom padding based on platform and safe area
//   const getBottomPadding = () => {
//     // For iOS devices with home indicator
//     if (Platform.OS === "ios" && insets.bottom > 0) {
//       return insets.bottom > 0 ? insets.bottom : 8;
//     }
//     // For Android devices with navigation bar
//     if (Platform.OS === "android") {
//       return insets.bottom + 8; // Add extra padding for Android
//     }
//     // Default padding for other devices
//     return 8;
//   };

//   // Authentication effect remains the same
//   useEffect(() => {
//     const checkUserStatus = async (user) => {
//       if (user) {
//         try {
//           const userRef = doc(db, "users", user.uid); // Get the user document from Firestore
//           const userDoc = await getDoc(userRef);

//           if (!userDoc.exists()) {
//             router.replace("/");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           router.replace("/");
//         }
//       } else {
//         router.replace("/");
//       }
//     };

//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       checkUserStatus(user);
//     });

//     return unsubscribe;
//   }, [router, segments]);

//   return (
//     <>
//       <StatusBar
//         backgroundColor="#000" // Android only
//         barStyle="light-content" // or "dark-content" for dark icons
//         translucent={false}
//       />
//       <SafeAreaView style={styles.container}>
//         <Tabs
//           screenOptions={({ route }) => ({
//             headerShown: false,
//             tabBarIcon: ({ focused, color, size }) => {
//               let iconName;

//               switch (route.name) {
//                 case "index":
//                   iconName = focused ? "layers" : "layers-outline";
//                   break;
//                 case "itinerary":
//                   iconName = focused ? "calendar" : "calendar-outline";
//                   break;
//                 case "members":
//                   iconName = focused ? "people" : "people-outline";
//                   break;
//                 case "profile":
//                   iconName = focused ? "person" : "person-outline";
//                   break;
//                 case "support":
//                   iconName = focused ? "help-circle" : "help-circle-outline";
//                   break;
//                 default:
//                   iconName = "alert-circle-outline";
//               }

//               return <Ionicons name={iconName} size={size} color={color} />;
//             },
//             // Updated tab bar styling with safe area considerations
//             tabBarStyle: ({ route }) => ({
//               display: route.name === "signin" ? "none" : "flex",
//               height: Platform.select({
//                 ios: 50 + getBottomPadding(), // Adjust height for iOS
//                 android: 60 + getBottomPadding(), // Adjust height for Android
//               }),
//               paddingBottom: getBottomPadding(),
//               paddingTop: 8,
//               width: width,
//               backgroundColor: "#000000",
//               position: "absolute", // This ensures the tab bar stays at the bottom
//               bottom: 0,
//               borderTopWidth: StyleSheet.hairlineWidth,
//               borderTopColor: "rgba(0, 0, 0, 0.2)",
//               elevation: 8, // Android shadow
//               shadowColor: "#000", // iOS shadow
//               shadowOffset: {
//                 width: 0,
//                 height: -2,
//               },
//               shadowOpacity: 0.1,
//               shadowRadius: 3,
//             }),
//             tabBarActiveTintColor: "#007AFF",
//             tabBarInactiveTintColor: "gray",
//             // Adjust tab bar label style
//             tabBarLabelStyle: {
//               paddingBottom: Platform.OS === "ios" ? 0 : 4,
//               fontSize: 12,
//             },
//             // Add proper hit slop area for better touch response
//             tabBarItemStyle: {
//               paddingVertical: 4,
//             },
//           })}
//         >
//           {/* Screen configurations remain the same */}

//           <Tabs.Screen
//             name="itinerary"
//             options={{
//               title: "Itinerary",
//             }}
//           />
//           <Tabs.Screen
//             name="members"
//             options={{
//               title: "Network",
//             }}
//           />
//           <Tabs.Screen
//             name="index"
//             options={{
//               title: "Data Models",
//             }}
//           />
//           <Tabs.Screen
//             name="profile"
//             options={{
//               title: "Profile",
//             }}
//           />

//           {/* Hidden tabs that are still accessible via navigation */}
//           <Tabs.Screen
//             name="support"
//             options={{
//               title: "Support",
//             }}
//           />
//           <Tabs.Screen
//             name="signin"
//             options={{
//               tabBarButton: () => null, // Hides the tab
//               tabBarStyle: { display: "none" }, // Hides tab bar on this screen
//             }}
//           />
//         </Tabs>
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
// });

// import { Tabs, useRouter, useSegments } from "expo-router";
// import { useEffect } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { auth, db } from "@/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { useWindowDimensions, Platform, View, StyleSheet } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "react-native";

// export default function ProtectedLayout() {
//   const router = useRouter();
//   const segments = useSegments();
//   const { width } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   const getBottomPadding = () => {
//     if (Platform.OS === "ios") {
//       return insets.bottom > 0 ? insets.bottom : 8;
//     }
//     if (Platform.OS === "android") {
//       return insets.bottom + 8;
//     }
//     return 8;
//   };

//   useEffect(() => {
//     const checkUserStatus = async (user) => {
//       if (user) {
//         try {
//           const userRef = doc(db, "users", user.uid);
//           const userDoc = await getDoc(userRef);

//           if (!userDoc.exists()) {
//             router.replace("/");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           router.replace("/");
//         }
//       } else {
//         router.replace("/");
//       }
//     };

//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       checkUserStatus(user);
//     });

//     return unsubscribe;
//   }, [router, segments]);

//   return (
//     <>
//       <StatusBar
//         backgroundColor="#000"
//         barStyle="light-content"
//         translucent={false}
//       />
//       <Tabs
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName;

//             switch (route.name) {
//               case "index":
//                 iconName = focused ? "layers" : "layers-outline";
//                 break;
//               case "itinerary":
//                 iconName = focused ? "calendar" : "calendar-outline";
//                 break;
//               case "members":
//                 iconName = focused ? "people" : "people-outline";
//                 break;
//               case "profile":
//                 iconName = focused ? "person" : "person-outline";
//                 break;
//               case "support":
//                 iconName = focused ? "help-circle" : "help-circle-outline";
//                 break;
//               default:
//                 iconName = "alert-circle-outline";
//             }

//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//           tabBarStyle: {
//             height: Platform.select({
//               ios: 60 + getBottomPadding(),
//               android: 70 + getBottomPadding(),
//             }),
//             paddingBottom: getBottomPadding(),
//             paddingTop: 8,
//             backgroundColor: "#fff",
//             position: "absolute",
//             borderTopLeftRadius: 30,
//             borderTopRightRadius: 30,
//             justifyContent: "space-around", // Ensure even space distribution across the tabs
//             width: "100%", // Make the tab bar occupy the full width of the screen
//           },
//           tabBarActiveTintColor: "#A32638",
//           tabBarInactiveTintColor: "#A9A9A9",
//           tabBarLabelStyle: {
//             paddingBottom: Platform.OS === "ios" ? 2 : 6,
//             fontSize: 11,
//           },
//           contentStyle: {
//             backgroundColor: "#fff",
//           },
//         })}
//         sceneContainerStyle={styles.sceneContainer}
//       >
//         <Tabs.Screen
//           name="itinerary"
//           options={{
//             title: "Itinerary",
//           }}
//         />
//         <Tabs.Screen
//           name="members"
//           options={{
//             title: "Network",
//           }}
//         />
//         <Tabs.Screen
//           name="index"
//           options={{
//             title: "Data Models",
//           }}
//         />
//         <Tabs.Screen
//           name="profile"
//           options={{
//             title: "Profile",
//           }}
//         />
//         <Tabs.Screen
//           name="support"
//           options={{
//             title: "Support",
//           }}
//         />
//         <Tabs.Screen
//           name="signin"
//           options={{
//             tabBarButton: () => null,
//             tabBarStyle: { display: "none" },
//           }}
//         />
//       </Tabs>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff", // Light gray background for better contrast
//   },
//   sceneContainer: {
//     flex: 1,
//     alignItems: "center", // Center horizontally
//     justifyContent: "center", // Center vertically
//     backgroundColor: "#fff",
//   },
// });

import { Tabs, useRouter, useSegments } from "expo-router";
import { useEffect, useState, createContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/firebaseConfig";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import supabase from "@/supabase.js";

export const AppContext = createContext();

const _layout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const [userData, setUserData] = useState({});
  const [headerData, setHeaderData] = useState({});

  const getBottomPadding = () => {
    if (Platform.OS === "ios") {
      return insets.bottom > 0 ? insets.bottom : 8;
    }
    if (Platform.OS === "android") {
      return insets.bottom + 8;
    }
    return 8;
  };

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
            setUserData({ id: userDoc.id, ...userDoc });
            setHeaderData(headerDoc);
            console.log(userDoc.name);
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
  }, [router, segments]);

  return (
    <AppContext.Provider value={{ userData, setUserData, headerData }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case "index":
                iconName = focused ? "apps" : "apps-outline";
                break;
              case "itinerary":
                iconName = focused ? "calendar" : "calendar-outline";
                break;
              case "members":
                iconName = focused ? "people" : "people-outline";
                break;
              case "profile":
                iconName = focused ? "person" : "person-outline";
                break;
              case "support":
                iconName = focused ? "trophy" : "trophy-outline";
                break;
              default:
                iconName = "alert-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#A32638",
          tabBarInactiveTintColor: "#A9A9A9",
          tabBarStyle: {
            height: Platform.select({
              ios: 60 + getBottomPadding(),
              android: 60 + getBottomPadding(),
            }),
            paddingBottom: getBottomPadding(),
            paddingTop: 8,
            backgroundColor: "#fff",
            position: "absolute",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        })}
      >
        <Tabs.Screen name="itinerary" options={{ title: "Itinerary" }} />
        <Tabs.Screen name="members" options={{ title: "Network" }} />
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="support" options={{ title: "SETS Team" }} />
      </Tabs>
    </AppContext.Provider>
  );
};

export default _layout;
