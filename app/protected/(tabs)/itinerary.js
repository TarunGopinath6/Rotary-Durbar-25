// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
//   Linking,
// } from "react-native";
// import moment from "moment";
// import { SafeAreaView } from "react-native-safe-area-context";
// import LinearGradient from "react-native-linear-gradient";

// const App = () => {
//   // Sample dictionary for testing
//   const posts = [
//     {
//       id: 1,
//       text: "RI Director Elect Anirudha Roy Chowdhury delivered an enthralling speech at SARVAM 3232 District Conference",
//       image: require("../../../assets/images/rotary_logo.png"),
//       cheers: 83,
//       event: "preSETS I",
//       timestamp: new Date().setHours(new Date().getHours() - 2),
//     },
//     {
//       id: 2,
//       text: "Thank you Magical Secretaries for such a wonderful session, hope you all enjoyed it!",
//       cheers: 83,
//       event: "preSETS I",
//       timestamp: new Date().setHours(new Date().getHours() - 2),
//     },
//     {
//       id: 3,
//       text: "Click on the link to fill in your feedback for the sessions",
//       link: "https://docs.google.com/forms/",
//       cheers: 83,
//       event: "preSETS I",
//       timestamp: new Date().setDate(new Date().getDate() - 1),
//     },
//     {
//       id: 4,
//       text: "RI Director Elect Anirudha Roy Chowdhury delivered an enthralling speech at SARVAM 3232 District Conference",
//       image: require("../../../assets/images/rotary_logo.png"),
//       cheers: 83,
//       event: "preSETS I",
//       timestamp: new Date().setHours(new Date().getHours() - 2),
//     },
//     {
//       id: 5,
//       text: "Thank you Magical Secretaries for such a wonderful session, hope you all enjoyed it!",
//       cheers: 83,
//       event: "preSETS I",
//       timestamp: new Date().setHours(new Date().getHours() - 2),
//     },
//     {
//       id: 6,
//       text: "Click on the link to fill in your feedback for the sessions",
//       link: "https://docs.google.com/forms/",
//       cheers: 83,
//       event: "preSETS I",
//       timestamp: new Date().setDate(new Date().getDate() - 1),
//     },
//   ];

//   const [activeTab, setActiveTab] = useState("All Posts");

//   // Filtered posts based on active tab
//   const filteredPosts = posts.filter((post) => {
//     if (activeTab === "Images") return post.image;
//     if (activeTab === "Links") return post.link;
//     return true;
//   });

//   const durbarDrumText = [
//     "All information regarding itinerary, fellow Magical Secretaries, your profile, support contacts and more will be available on this SETS app. The Team will update current events in real-time!",
//     "ATTENTION: Pre SETS I Session - 2 will resume in the Grand Hall at 11:15 am after the coffee break.",
//     "All information regarding itinerary, fellow Magical Secretaries, your profile, support contacts and more will be available on this SETS app. The Team will update current events in real-time!",
//     "ATTENTION: Pre SETS I Session - 2 will resume in the Grand Hall at 11:15 am after the coffee break.",
//   ];

//   const formatTimestamp = (timestamp) => {
//     const now = moment();
//     const postTime = moment(timestamp);

//     if (now.isSame(postTime, "day")) {
//       const diff = now.diff(postTime, "hours");
//       return `${diff} hours ago`;
//     } else if (now.subtract(1, "days").isSame(postTime, "day")) {
//       return "Yesterday";
//     } else {
//       const diff = now.diff(postTime, "days");
//       return `${diff} days ago`;
//     }
//   };

//   return (
//     <>
//       <StatusBar
//         backgroundColor="#A32638"
//         barStyle="light-content"
//         translucent={false}
//       />
//       <ScrollView style={styles.container} nestedScrollEnabled>
//         {/* Header */}
//         <View style={styles.header}>
//           <Image
//             source={require("../../../assets/images/mysore_palace.png")}
//             style={styles.headerImage}
//           />
//           <Text style={styles.headerText}>The Itinerary</Text>
//           {/* <Text style={styles.headerSubText}>preSETS I</Text> */}
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabsContainer}>
//           {["All Posts", "Images", "Links"].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={[styles.tab, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === tab && styles.activeTabText,
//                 ]}
//               >
//                 {tab}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Posts */}
//         <FlatList
//           data={filteredPosts}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.postContainer}>
//               <Text style={styles.postText}>{item.text}</Text>
//               {item.image && (
//                 <Image source={item.image} style={styles.postImage} />
//               )}
//               {item.link && (
//                 <Text
//                   style={styles.postLink}
//                   onPress={() => Linking.openURL(item.link)}
//                 >
//                   {item.link}
//                 </Text>
//               )}
//               <View style={styles.postFooter}>
//                 <View style={styles.cheersContainer}>
//                   <Image
//                     source={require("../../../assets/images/cheer_icon.png")}
//                     style={styles.cheerIcon}
//                   />
//                   <Text style={styles.cheersText}>{item.cheers} cheers</Text>
//                 </View>
//                 <Text style={styles.eventText}>{item.event}</Text>
//                 <Text style={styles.timestamp}>
//                   {formatTimestamp(item.timestamp)}
//                 </Text>
//               </View>
//             </View>
//           )}
//           contentContainerStyle={{
//             paddingBottom: 80, // Height of the tab navigator
//           }}
//         />
//       </ScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   header: {
//     backgroundColor: "#A32638",
//     paddingBottom: 20,
//     paddingTop: 0,
//     position: "relative",
//     height: "120",
//     justifyContent: "center",
//     zIndex: 0,
//   },
//   headerImage: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     padding: 0,
//     margin: 0,
//     resizeMode: "cover",
//     opacity: 0.28,
//   },
//   headerText: {
//     fontSize: 26,
//     padding: 10,
//     paddingHorizontal: 20,
//     color: "#FFBD1B",
//     fontFamily: "Inter_500Medium",
//     backgroundColor: "rgba(163, 38, 56, 0.3)",
//   },
//   headerSubText: {
//     fontSize: 16,
//     padding: 5,
//     color: "#FFBD1B",
//     textAlign: "center",
//     backgroundColor: "rgba(163, 38, 56, 0.3)",
//     fontFamily: "Inter_500Medium",
//   },
//   headerDate: {
//     fontSize: 14,
//     padding: 3,
//     color: "#FFBD1B",
//     textAlign: "center",
//     fontFamily: "Inter_500Medium",
//     backgroundColor: "rgba(163, 38, 56, 0.3)",
//   },
//   logosContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: -25,
//     zIndex: 1,
//   },
//   tabsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "#FFF",
//     marginVertical: 10,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: -25,
//     padding: 15,
//     zIndex: 1,
//   },
//   tab: {
//     padding: 10,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#A32638",
//   },
//   tabText: {
//     fontSize: 14,
//     fontFamily: "Inter_400Regular",
//   },
//   activeTabText: {
//     color: "#A32638",
//   },
//   postContainer: {
//     margin: 10,
//     padding: 15,
//     backgroundColor: "#FFF",
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   postImage: {
//     width: "100%",
//     height: 200,
//     resizeMode: "contain",
//     borderRadius: 10,
//   },
//   postText: {
//     fontSize: 14,
//     color: "#000",
//     marginVertical: 5,
//     letterSpacing: 0.5,
//   },
//   postLink: {
//     fontSize: 14,
//     color: "#17458F",
//     textDecorationLine: "underline",
//   },
//   postFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   cheersContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   cheerIcon: {
//     width: 30,
//     height: 30,
//     marginRight: 5,
//   },
//   cheersText: {
//     fontSize: 13,
//     color: "#A32638",
//   },
//   eventText: {
//     fontSize: 13,
//     color: "#17458F",
//   },
//   timestamp: {
//     fontSize: 13,
//     color: "#999",
//   },
// });

// export default App;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
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

const ItineraryScreen = () => {
  const [activeTab, setActiveTab] = useState("Day 1");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tabNames, setTabNames] = useState([]);
  const [dataDates, setDataDates] = useState([]);

  const hasRun = useRef(false);

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

  const fetchTabs = async () => {
    setLoading(true);
    try {
      if (hasRun.current === false) {
        const itinerariesDatesRef = collection(db, "itineraries_dates");
        let qDatesRef = query(itinerariesDatesRef);
        const querySnapshotDatesRef = await getDocs(qDatesRef);

        const dataDatesOut = querySnapshotDatesRef.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDataDates(dataDatesOut);

        const dayList = Array.from(
          { length: dataDatesOut.length },
          (_, index) => `Day ${index + 1}`
        );
        setTabNames(dayList);

        console.log(new Date(dataDatesOut[0]["date"]["seconds"]));
        console.log(dataDatesOut);
        hasRun.current = true;
      } else {
        console.log("secondary runs");
      }
    } catch (error) {
      console.error("Error fetching tabs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, [activeTab]);

  const renderTimeSlot = ({ item }) => (
    <View style={styles.timeSlotContainer}>
      <Text style={styles.timestamp}>
        {item.startTime} - {item.endTime}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedEvent(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.eventCard}>
          <View style={styles.eventContent}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.eventMeta}>
                <Text style={styles.eventType}>{item.type}</Text>
                <Text style={styles.eventVenue}>{item.venue}</Text>
              </View>
            </View>
            <Image source={item.image} style={styles.eventImage} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDaySection = ({ item }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLine} />
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <View style={styles.sectionLine} />
      </View>
      <EventModal />
      {item.events.map((event, index) => (
        <View key={index}>{renderTimeSlot({ item: event })}</View>
      ))}
    </View>
  );

  // Sample data structure
  const dayData = {
    "Day 1": [
      {
        title: "Morning",
        events: [
          {
            startTime: "10 am",
            endTime: "10:45 am",
            title: "Address by District Governor Elect",
            type: "Training Session",
            venue: "Grand Hall",
            image: require("../../../assets/images/rotary_logo.png"),
            description:
              "Kicking off a splendid day, DGE Rtn. Vinod Sarogi will set the tone for the magical training sessions to come with immense value, fun and frolic.An inspirational talk about his experience and journey with Rotary kindling the spirit of all gathered magical secretaries",
          },
          {
            startTime: "10:45 am",
            endTime: "5:45 pm",
            title: "Fun Visit to the Mysore Zoo",
            type: "Leisure",
            venue: "Mysore Zoo",
            image: require("../../../assets/images/rotary_logo.png"),
          },
        ],
      },
      {
        title: "Afternoon",
        events: [
          {
            startTime: "10 am",
            endTime: "10:45 am",
            title: "Address by District Governor Elect",
            type: "Training Session",
            venue: "Grand Hall",
            image: require("../../../assets/images/rotary_logo.png"),
          },
          {
            startTime: "10:45 am",
            endTime: "5:45 pm",
            title: "Fun Visit to the Mysore Zoo",
            type: "Leisure",
            venue: "Mysore Zoo",
            image: require("../../../assets/images/rotary_logo.png"),
          },
        ],
      },
    ],
    "Day 2": [
      {
        title: "Morning",
        events: [
          {
            startTime: "10 am",
            endTime: "10:45 am",
            title: "Address by SETS Chairman",
            type: "Training Session",
            venue: "Grand Hall",
            image: require("../../../assets/images/rotary_logo.png"),
          },
          {
            startTime: "10:45 am",
            endTime: "5:45 pm",
            title: "Fun Visit to the Mysore Zoo",
            type: "Leisure",
            venue: "Mysore Zoo",
            image: require("../../../assets/images/rotary_logo.png"),
          },
        ],
      },
      {
        title: "Afternoon",
        events: [
          {
            startTime: "10 am",
            endTime: "10:45 am",
            title: "Address by District Governor Elect",
            type: "Training Session",
            venue: "Grand Hall",
            image: require("../../../assets/images/rotary_logo.png"),
          },
          {
            startTime: "10:45 am",
            endTime: "5:45 pm",
            title: "Fun Visit to the Mysore Zoo",
            type: "Leisure",
            venue: "Mysore Zoo",
            image: require("../../../assets/images/rotary_logo.png"),
          },
        ],
      },
    ],
    "Day 3": [
      {
        title: "Morning",
        events: [
          {
            startTime: "10 am",
            endTime: "10:45 am",
            title: "Address by District Governor Elect",
            type: "Training Session",
            venue: "Grand Hall",
            image: require("../../../assets/images/rotary_logo.png"),
          },
          {
            startTime: "10:45 am",
            endTime: "5:45 pm",
            title: "Fun Visit to the Mysore Zoo",
            type: "Leisure",
            venue: "Mysore Zoo",
            image: require("../../../assets/images/rotary_logo.png"),
          },
        ],
      },
      {
        title: "Afternoon",
        events: [
          {
            startTime: "10 am",
            endTime: "10:45 am",
            title: "Address by District Governor Elect",
            type: "Training Session",
            venue: "Grand Hall",
            image: require("../../../assets/images/rotary_logo.png"),
          },
          {
            startTime: "10:45 am",
            endTime: "5:45 pm",
            title: "Fun Visit to the Mysore Zoo",
            type: "Leisure",
            venue: "Mysore Zoo",
            image: require("../../../assets/images/rotary_logo.png"),
          },
        ],
      },
    ],
  };

  const EventModal = () => {
    if (!selectedEvent) return null;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Image source={selectedEvent.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                <View style={styles.modalTimeContainer}>
                  <Text style={styles.modalTime}>
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </Text>
                  <Text style={styles.modalTime}>{selectedEvent.venue}</Text>
                </View>
                <Text style={styles.modalVenue}>{activeTab}</Text>
                <Text style={styles.modalDescription}>
                  {selectedEvent.description || "No description available."}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/mysore_palace.png")}
          style={styles.headerImage}
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>The Itinerary</Text>
          <Text style={styles.headerSubText}>preSETS I</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabNames.map((tab) => (
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

      {/* Day Content */}
      <FlatList
        data={dayData[activeTab]}
        renderItem={renderDaySection}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 26,
    color: "#FFBD1B",
    fontFamily: "Inter_500Medium",
  },
  headerSubText: {
    fontSize: 16,
    color: "#FFBD1B",
    fontFamily: "Inter_500Medium",
  },
  tabsContainer: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    zIndex: 1,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A32638",
  },
  activeTab: {
    backgroundColor: "#A32638",
  },
  tabText: {
    color: "#A32638",
    fontFamily: "Inter_500Medium",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 10,
  },
  sectionContainer: {
    marginVertical: 10,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#A32638",
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFBD1B",
  },
  timeSlotContainer: {
    marginBottom: 15,
  },
  timestamp: {
    fontSize: 14,
    color: "#A32638",
    fontFamily: "Inter_500Medium",
    marginBottom: 7,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 5,
  },
  eventContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventInfo: {
    flex: 1,
    justifyContent: "space-between",
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginBottom: 5,
  },
  eventMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventType: {
    fontSize: 12.5,
    color: "#A32638",
  },
  eventVenue: {
    fontSize: 12.5,
    color: "#666",
  },
  eventImage: {
    width: 75,
    height: 75,
    borderRadius: 75,
    borderColor: "#666",
    resizeMode: "cover",
    // borderWidth: 1,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    paddingVertical: 30,
    width: "85%",
    elevation: 8,
    alignItems: "center",
  },
  modalImage: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  modalTime: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Inter_500Medium",
  },
  modalVenue: {
    fontSize: 16,
    color: "#A32638",
    fontFamily: "Inter_500Medium",
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter_400Regular",
    textAlign: "justify",
    lineHeight: 20,
  },
});

export default ItineraryScreen;
