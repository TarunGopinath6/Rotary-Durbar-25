import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking,
} from "react-native";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import moment from "moment";
import { AppContext } from "./_layout";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

// import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  // Sample dictionary for testing
  const [activeTab, setActiveTab] = useState("All Posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, setUserData } = useContext(AppContext);
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postRef = collection(db, "posts");
      let q = query(postRef);
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filtered posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "Images") return post.image;
    if (activeTab === "Links") return post.link;
    return true;
  });

  const durbarDrumText = [
    "All information regarding itinerary, fellow Magical Secretaries, your profile, support contacts and more will be available on this SETS app. The Team will update current events in real-time!",
    "ATTENTION: Pre SETS I Session - 2 will resume in the Grand Hall at 11:15 am after the coffee break.",
    "All information regarding itinerary, fellow Magical Secretaries, your profile, support contacts and more will be available on this SETS app. The Team will update current events in real-time!",
    "ATTENTION: Pre SETS I Session - 2 will resume in the Grand Hall at 11:15 am after the coffee break.",
  ];

  const formatTimestamp = (timestamp) => {
    const now = moment();
    const postTime = moment(timestamp);

    if (now.isSame(postTime, "day")) {
      const diff = now.diff(postTime, "hours");
      return `${diff} hours ago`;
    } else if (now.subtract(1, "days").isSame(postTime, "day")) {
      return "Yesterday";
    } else {
      const diff = now.diff(postTime, "days");
      return `${diff} days ago`;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="#A32638"
        barStyle="light-content"
        translucent={false}
      />
      <ScrollView style={styles.container} nestedScrollEnabled>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/images/mysore_palace.png")}
            style={styles.headerImage}
          />
          <Text style={styles.headerText}>
            Hi, Rtn. {userData?.name ?? "NA"}!
          </Text>
          <Text style={styles.headerSubText}>
            Prepare to be spellbound by preSETS I
          </Text>
          <Text style={styles.headerDate}>January 15th - 18th, 2024</Text>
        </View>

        {/* Rotary Logos */}
        <View style={styles.logosContainer}>
          <Image
            source={require("../../../assets/images/rotary_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>District 3234</Text>
          <Image
            source={require("../../../assets/images/rotary_slogan.png")}
            style={styles.logo}
          />
        </View>

        {/* Durbar Drum Section */}
        <View style={styles.drumContainer}>
          <Text style={styles.drumHeader}>The Durbar Drum</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled
          >
            {durbarDrumText.map((point, index) => (
              <View key={index} style={styles.bulletPointContainer}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["All Posts", "Images", "Links"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading === true && "Loading..."}

        {filteredPosts.map((item, index) => (
          <View style={styles.postContainer} key={index}>
            <Text style={styles.postText}>{item.text}</Text>
            {item.image && (
              <Image source={item.image} style={styles.postImage} />
            )}
            {item.link && (
              <Text
                style={styles.postLink}
                onPress={() => Linking.openURL(item.link)}
              >
                {item.link}
              </Text>
            )}
            <View style={styles.postFooter}>
              <View style={styles.cheersContainer}>
                <Image
                  source={require("../../../assets/images/cheer_icon.png")}
                  style={styles.cheerIcon}
                />
                <Text style={styles.cheersText}>{item.cheers} cheers</Text>
              </View>
              <Text style={styles.eventText}>{item.event}</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
          </View>
        ))}
        <View
          style={{ width: "100%", height: 100, backgroundColor: "#fff" }}
        ></View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
    height: "160",
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
    fontSize: 24,
    padding: 10,
    paddingHorizontal: 20,
    color: "#FFBD1B",
    fontFamily: "Inter_700Bold",
  },
  headerSubText: {
    fontSize: 16,
    padding: 5,
    color: "#FFBD1B",
    textAlign: "center",
    backgroundColor: "rgba(163, 38, 56, 0.3)",
    fontFamily: "Inter_500Medium",
  },
  headerDate: {
    fontSize: 14,
    padding: 3,
    color: "#FFBD1B",
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    backgroundColor: "rgba(163, 38, 56, 0.3)",
  },
  logosContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    zIndex: 1,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 17,
    color: "#17458F",
    fontFamily: "Inter_700Bold",
  },
  drumContainer: {
    backgroundColor: "#FFFFF0",
    borderWidth: 2,
    borderColor: "gold",
    borderRadius: 30,
    padding: 16,
    height: 200, // Constant height
    margin: 16,
    overflow: "scroll", // Ensure no content leaks outside the container
    shadowColor: "#FFBD1B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8, // Glow effect
    elevation: 10, // For Android shadow
  },
  drumBorder: {
    margin: 16,
    borderRadius: 16,
    padding: 2, // Add padding for the border effect
    shadowColor: "#FFBD1B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8, // Glow effect
    elevation: 8, // For Android shadow
  },
  scrollContent: {
    paddingVertical: 8,
  },
  bulletPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletSymbol: {
    color: "#A32638", // Red shade for bullet
    fontSize: 20,
    marginRight: 8,
  },
  bulletText: {
    color: "black", // Blue shade for text
    fontSize: 14,
    flex: 1, // Ensure the text wraps properly
  },
  drumHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#A32638", // Red shade for the header
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    marginVertical: 10,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#A32638",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  activeTabText: {
    color: "#A32638",
  },
  postContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#DDD",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
  },
  postText: {
    fontSize: 14,
    color: "#000",
    marginVertical: 5,
    letterSpacing: 0.5,
  },
  postLink: {
    fontSize: 14,
    color: "#17458F",
    textDecorationLine: "underline",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cheersContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cheerIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  cheersText: {
    fontSize: 13,
    color: "#A32638",
  },
  eventText: {
    fontSize: 13,
    color: "#17458F",
  },
  timestamp: {
    fontSize: 13,
    color: "#999",
  },
});

export default App;
