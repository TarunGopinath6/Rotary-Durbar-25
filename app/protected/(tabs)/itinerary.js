import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
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

const ItineraryScreen = () => {
  const [activeTab, setActiveTab] = useState("Day 1");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // FEEDBACK STATES
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [tabNames, setTabNames] = useState([]);
  const [dataDates, setDataDates] = useState([]);
  const [itinerariesList, setItinerariesList] = useState([]);

  const { headerData, userData } = useContext(AppContext);

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

  const fetchData = async (dataDatesList, tabIndex) => {
    let startDateFilter = new Date(dataDatesList[tabIndex]); // Convert Firestore Timestamp to Date
    let endDateFilter = new Date(
      startDateFilter.getTime() + 24 * 60 * 60 * 1000
    );

    try {
      console.log(userData.id);
      const { data: itineraries, error } = await supabase
        .from("itineraries")
        .select("*")
        .gte("startTime", startDateFilter.toISOString()) // Filter events that start after startDateFilter
        .lte("startTime", endDateFilter.toISOString()) // Filter events that start before endDateFilter
        .order("startTime", { ascending: true });

      if (error) throw error;

      let finalData = [
        { title: "Morning", events: [] },
        { title: "Afternoon", events: [] },
        { title: "Evening", events: [] },
      ];

      itineraries.forEach((data) => {
        // Convert the startTime and endTime from ISO strings to Date objects
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        // Format time strings to local time (e.g., "12:30 PM")
        const formattedStartTime = moment(startTime).format("hh:mm A");
        const formattedEndTime = moment(endTime).format("hh:mm A");

        // Determine whether the event is morning or afternoon
        if (moment(startTime).hour() < 12) {
          // Morning event
          finalData[0].events.push({
            id: data.id,
            ...data, // Include other fields from Supabase data
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          });
        } else if (
          moment(startTime).hour() >= 12 &&
          moment(startTime).hour() < 16
        ) {
          finalData[1].events.push({
            id: data.id,
            ...data, // Include other fields from Supabase data
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          });
        } else {
          // Afternoon event
          finalData[2].events.push({
            id: data.id,
            ...data, // Include other fields from Supabase data
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          });
        }
      });

      setItinerariesList(finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    return;
  };

  const fetchTabs = async () => {
    setLoading(true);
    try {
      if (hasRun.current === false) {
        const { data: itinerariesDates, error } = await supabase.rpc(
          "get_distinct_start_dates"
        );

        if (error) {
          console.error("Error fetching distinct dates:", error);
          return;
        }

        const dataDatesOut = itinerariesDates.map((record) => {
          return record["distinct_date"];
        });
        setDataDates(dataDatesOut);
        const dayList = Array.from(
          { length: dataDatesOut.length },
          (_, index) => `Day ${index + 1}`
        );
        setTabNames(dayList);

        if (dayList.length <= 0) {
          setItinerariesList([]);
          return;
        }

        await fetchData(dataDatesOut, 0);
        hasRun.current = true;
      } else {
        console.log("secondary runs");
        let tabIndex = tabNames.indexOf(activeTab);
        await fetchData(dataDates, tabIndex);
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
            <Image source={{ uri: item.image }} style={styles.eventImage} />
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
      {item.events.map((event, index) => (
        <View key={index}>{renderTimeSlot({ item: event })}</View>
      ))}
    </View>
  );

  const handleFeedbackSubmit = async (feedbackText) => {
    if (feedbackText.length > 0 && feedbackText.length < 501) {
      const { data, error } = await supabase.from("feedback").insert([
        {
          user_id: userData.id,
          itinerary_id: selectedEvent.id,
          comment: feedbackText,
        },
      ]);
    }

    //.onConflict(['user_id', 'post_id']); // Prevent duplicates by user_id and post_id

    if (error) {
      console.error("Error adding feedback:", error);
    } else {
      console.log("Feedback added successfully:", data);
    }
    // Clear feedback after submission
  };

  const EventModal = () => {
    if (!selectedEvent) return null;
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [feedbackValues, setFeedbackValues] = useState([]);
    const [canUserFeedback, setCanUserFeedback] = useState(false);
    const [offsetDoc, setOffsetDoc] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const PAGE_SIZE = 10;

    const getComments = async (offset = 0) => {
      try {
        const { data: permCheck, error: errorPermCheck } = await supabase
          .from("feedback")
          .select("id") // Only select the ID to reduce payload size
          .eq("itinerary_id", selectedEvent.id)
          .eq("user_id", userData.id);

        if (errorPermCheck) {
          console.error("Error checking feedback perms:", error);
          return [];
        }

        if (permCheck.length === 0 || permCheck === null)
          setCanUserFeedback(true);

        const { data: feedbackData, error: errorData } = await supabase
          .from("feedback")
          .select("*, members(name)")
          .eq("itinerary_id", selectedEvent.id)
          .order("created_at", { ascending: false }) // Sort by created_at in descending order
          .range(offset, offset + PAGE_SIZE - 1);

        if (errorData) {
          console.error("Error retriving feedback:", error);
          return [];
        }
        console.log(feedbackData);
        return feedbackData;
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };

    const loadFeedback = async (reset = false) => {
      if (loadingFeedback) return;
      setLoadingFeedback(true);

      let response = null;
      if (reset) {
        response = await getComments(0);
        setFeedbackValues(response);
        setOffsetDoc(response.length);
      } else {
        response = await getComments(offsetDoc);
        setFeedbackValues((prev) => [...prev, ...response]);
        setOffsetDoc(offsetDoc + response.length);
      }

      if (response.length < PAGE_SIZE) {
        setHasMore(false); // No more data if fewer than limit records are returned
      }

      setLoadingFeedback(false);
    };

    useEffect(() => {
      if (modalVisible) {
        loadFeedback(true);
      }
    }, []);

    const isCloseToBottom = ({
      layoutMeasurement,
      contentOffset,
      contentSize,
    }) => {
      const paddingToBottom = 100; // Adjust based on your needs

      console.log(
        layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom
      );
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              bounces={true}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  console.log("jjjjjjj");
                  if (hasMore) loadFeedback();
                }
              }}
              scrollEventThrottle={400}
            >
              <Image
                source={{ uri: selectedEvent.image }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalTime}>
                {selectedEvent.startTime} - {selectedEvent.endTime}
              </Text>
              <Text style={styles.modalTime}>{selectedEvent.venue}</Text>
              <Text style={styles.modalVenue}>{activeTab}</Text>
              <Text style={styles.modalDescription}>
                {selectedEvent.description || "No description available."}
              </Text>

              {canUserFeedback && (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    setFeedbackEvent(true);
                    setModalVisible(false);
                    setFeedbackModalVisible(true);
                  }}
                >
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
              )}

              {feedbackValues.length > 0 && (
                <View style={styles.feedbackContainer}>
                  <View style={styles.feedbackHeader}>
                    <Text style={styles.feedbackTitle}>Feedback</Text>
                    <View style={styles.feedbackLine} />
                  </View>

                  {feedbackValues.map((feedback) => (
                    <View key={feedback.id} style={styles.feedbackItem}>
                      <Text style={styles.feedbackUser}>
                        {feedback.members.name}
                      </Text>
                      <Text style={styles.feedbackComment}>
                        {feedback.comment}
                      </Text>
                    </View>
                  ))}

                  {loadingFeedback && <Text>Loading feedback...</Text>}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // FEEDBACK MODAL
  const FeedbackModal = () => {
    const [feedbackText, setFeedbackText] = useState("");

    if (!feedbackEvent) return null;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={[
              styles.modalContent,
              { paddingVertical: 20, paddingHorizontal: 20 },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFeedbackModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Share Your Feedback</Text>

            <TextInput
              style={styles.feedbackInput}
              placeholder="Enter your feedback"
              placeholderTextColor="#666"
              multiline
              value={feedbackText}
              maxLength={500}
              onChangeText={(text) => setFeedbackText(text)}
            />

            <Text
              style={styles.charCounter}
            >{`${feedbackText.length}/500`}</Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log("Feedback:", feedbackText);
                handleFeedbackSubmit(feedbackText);
                setFeedbackText("");
                setFeedbackModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            height: Platform.OS === "ios" ? 160 : 120,
            paddingTop: Platform.OS === "ios" ? 30 : 0,
          },
        ]}
      >
        <Image
          source={require("../../../assets/images/mysore_palace.png")}
          style={styles.headerImage}
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>The Itinerary</Text>
          {/* <Text style={styles.headerSubText}>
            {headerData?.event_name ?? "Event"}
          </Text> */}
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

      <EventModal />

      {/* Day Content */}
      <FeedbackModal />

      <FlatList
        // data={dayData[activeTab]}
        data={itinerariesList}
        renderItem={renderDaySection}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        style={styles.content}
        ListFooterComponent={() =>
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
  },
  feedbackInput: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 15,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
    textAlignVertical: "top",
    marginBottom: 10,
    marginTop: 20,
  },
  charCounter: {
    alignSelf: "flex-end",
    color: "#666",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#A32638",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: "50%",
  },
  submitButtonText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#A32638",
    paddingBottom: 20,
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
    fontSize: 17,
    color: "#A32638",
    fontFamily: "Inter_700Bold",
    marginHorizontal: 15,
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
    width: "85%",
    maxHeight: "80%",
    elevation: 8,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
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
  modalTime: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
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
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#A32638",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    textAlign: "center",
  },
  feedbackContainer: {
    width: "100%",
    marginTop: 20,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  feedbackTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#333",
    marginHorizontal: 3,
  },
  feedbackLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
    marginLeft: 10,
  },
  feedbackItem: {
    marginBottom: 15,
    width: "100%",
  },
  feedbackUser: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#a32638",
  },
  feedbackComment: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#666",
    marginTop: 5,
  },
});

export default ItineraryScreen;
