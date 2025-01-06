import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
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
import supabase from "@/supabase.js";

// import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  // Sample dictionary for testing
  const [activeTab, setActiveTab] = useState("All Posts");
  const [posts, setPosts] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData, setUserData, headerData } = useContext(AppContext);
  const [refresh, setRefresh] = useState(null);

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
      //const { data: postData, errorPosts } = await supabase.from('posts').select('*')

      const { data: postData, error: errorPosts } = await supabase.rpc(
        "fetch_posts_with_likes_and_user_status",
        { user_id: `${userData.id}` }
      );
      if (errorPosts) {
        console.error("Error fetching posts:", errorPosts);
        return;
      }

      console.log(postData);
      setPosts(postData);

      const { data: notifsData, errorNotifs } = await supabase
        .from("notifs")
        .select("*");
      if (errorNotifs) {
        console.error("Error fetching notifs:", errorNotifs);
        return;
      }
      setNotifs(notifsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const [activePostId, setActivePostId] = useState(null); // Track the active post for overlay
  const lastPress = useRef(0);
  const handleDoublePress = (userId, postId, user_has_liked) => {
    if (user_has_liked) return;

    const currentTime = Date.now();
    const timeDifference = currentTime - lastPress.current;

    if (timeDifference < 300) {
      likePost(userId, postId);
      setActivePostId(postId);
      setTimeout(() => setActivePostId(null), 1000); // Show overlay for 1 second
    }

    lastPress.current = currentTime;
  };

  const likePost = async (userId, postId) => {
    // First, check if the user has already liked this post
    const { data, error } = await supabase.from("likes").insert([
      {
        user_id: userId,
        post_id: postId,
      },
    ]);
    //.onConflict(['user_id', 'post_id']); // Prevent duplicates by user_id and post_id

    if (error) {
      console.error("Error liking post:", error);
    } else {
      console.log("Post liked successfully:", data);
      setRefresh(new Date());
    }
  };

  const unlikePost = async (userId, postId) => {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .match({ user_id: userId, post_id: postId });

    if (error) {
      console.error("Error unliking post:", error);
    } else {
      console.log("Post unliked successfully:", data);
      alert("Post unliked successfully");
      Alert.alert("Post unliked successfully");
      setRefresh(new Date());
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  // Filtered posts based on active tab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "Images") return post.image;
    if (activeTab === "Links") return post.link;
    return true;
  });

  const formatTimestamp = (timestamp) => {
    // console.log(timestamp)
    const now = moment();
    const postTime = moment(timestamp);
    // console.log(now.diff(postTime, "days"))

    if (now.isSame(postTime, "day")) {
      const diff = now.diff(postTime, "hours");
      return `${diff} hours ago`;
    } else if (now.diff(postTime, "days") === 1) {
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
        <View style={styles.topBackground} />

        {/* Header */}
        <View
          style={[
            styles.header,
            {
              height: Platform.OS === "ios" ? 200 : 160,
              paddingTop: Platform.OS === "ios" ? 30 : 0,
            },
          ]}
        >
          <Image
            source={require("../../../assets/images/mysore_palace.png")}
            style={styles.headerImage}
          />
          <Text style={styles.headerText}>
            Hi, Rtn.{userData?.name ?? "NA"}!
          </Text>
          <Text style={styles.headerSubText}>
            {headerData?.event_name ?? "Event"}
          </Text>
          <Text style={styles.headerDate}>{headerData?.date_string ?? ""}</Text>
        </View>

        {/* Rotary Logos */}
        <View style={styles.logosContainer}>
          <Image
            source={require("../../../assets/images/rotary_logo.png")}
            style={styles.logo}
          />
          <Image
            source={require("../../../assets/images/district_3234.png")}
            style={styles.logo}
          />
          {/* <Text style={styles.logoText}>District 3234</Text> */}
          <Image
            source={require("../../../assets/images/durbar_badge.png")}
            style={styles.logo}
          />
        </View>

        {loading === true && (
          <View style={styles.loadingContainer}>
            <Image
              source={require("../../../assets/images/cheer_icon.png")}
              style={styles.overlayImage}
            />
            <Text style={{ margin: "10px" }}>Loading...</Text>
          </View>
        )}

        {/* <Text>{headerData?.governor_message ?? ""}</Text> */}
        {headerData?.governor_message && (
          <View style={styles.governorMessageContainer}>
            <View style={styles.governorMessageHeader}>
              <Text style={styles.messageLabel}>Message from</Text>
              <Text style={styles.governorName}>DGE Rtn. Vinod Sarogi</Text>
            </View>
            <Text style={styles.governorMessageText}>
              {headerData.governor_message}
            </Text>
          </View>
        )}

        {/* Durbar Drum Section */}
        {notifs.length > 0 && (
          <View style={styles.drumContainer}>
            <Text style={styles.drumHeader}>The Durbar Drum</Text>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              nestedScrollEnabled
            >
              {notifs.map((record, index) => (
                <View key={index} style={styles.bulletPointContainer}>
                  <Text style={styles.bulletSymbol}>•</Text>
                  <Text style={styles.bulletText}>{record.data}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tabs */}
        {filteredPosts.length > 0 && (
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
        )}

        {filteredPosts.map((item, index) => (
          <TouchableOpacity
            style={styles.postContainer}
            key={index}
            onPress={() =>
              handleDoublePress(userData.id, item.post_id, item.user_has_liked)
            }
          >
            <Text style={styles.postText}>{item.text}</Text>
            {item.link && (
              <Text
                style={styles.postLink}
                onPress={() => Linking.openURL(item.link)}
              >
                {item.link}
              </Text>
            )}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}

            <View style={styles.postFooter}>
              <View style={styles.cheersContainer}>
                <Image
                  source={require("../../../assets/images/cheer_icon.png")}
                  style={styles.cheerIcon}
                />
                <Text style={styles.cheersText}>{item.likes_count} cheers</Text>
                {/* <TouchableOpacity
                  title="Like"
                  onPress={() => likePost(userData.id, item.post_id)}
                />
                <TouchableOpacity
                  title="Remove Like"
                  onPress={() => unlikePost(userData.id, item.post_id)}
                />
                <Text>{item.user_has_liked === true && "LIKED"}</Text> */}
                {/* <Text>{item.post_id}</Text> */}
              </View>
              <Text style={styles.eventText}>{item.event}</Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.timedata)}
              </Text>
            </View>
            {activePostId === item.post_id && ( // Show overlay only for the active post
              <View style={styles.overlay}>
                <Image
                  source={require("../../../assets/images/cheer_icon.png")}
                  style={styles.overlayImage}
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
        <View
          style={{ width: "100%", height: 100, backgroundColor: "#fff" }}
        ></View>
      </ScrollView>
    </>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  governorMessageContainer: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#A32638",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  governorMessageHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFBD1B",
    alignItems: "center",
  },
  messageLabel: {
    fontSize: 14,
    color: "#A32638",
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
    width: "100%",
    textAlign: "center",
  },
  governorName: {
    fontSize: 18,
    color: "#A32638",
    fontFamily: "Inter_600SemiBold",
    width: "100%",
    textAlign: "center",
  },
  governorMessageText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    width: "100%",
    textAlign: "left",
    paddingBottom: 5,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.2,
    width: "100%",
    backgroundColor: "#a32638",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255, 0.5)", // Slight transparent overlay
    borderRadius: 30,
  },
  overlayImage: {
    width: 50, // Adjust the size as needed
    height: 50,
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
    height: 160,
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
    padding: 10,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 14,
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
    resizeMode: "fill",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#dedede",
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
    marginTop: 0,
    marginBottom: 10,
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
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255, 0.5)", // Slight transparent overlay
    borderRadius: 30,
  },
});

export default App;
