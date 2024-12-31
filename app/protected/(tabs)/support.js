import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";

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
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "@/firebaseConfig";
import supabase from "@/supabase.js";

export default function Support() {
  const [support, setSupport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const PAGE_SIZE = 10;

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

  const fetchMembers = async (queryText = "") => {
    let query = supabase
      .from("members")
      .select("id, sets_designation, affiliation, name, club_name, photograph, phone, email, business_address")
      .eq("support", true)
      .eq("role", "member")
      .order("priority", { descending: true });

    if (queryText) {
      query = query.or(
        `name.ilike.%${queryText}%,sets_designation.ilike.%${queryText}%,club_name.ilike.%${queryText}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching members:", error);
      return [];
    }
    return data;
  };

  const loadMembers = async (queryText = "") => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);

    console.log("searching", queryText);
    let response = await fetchMembers(queryText);
    setSupport(response);

    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    // handleSearch(searchQuery);
    loadMembers(searchQuery);
  }, [searchQuery]);

  const formatClubName = (name) => {
    const words = name.split(" ");
    const firstLine = words.slice(0, 3).join(" ");
    const secondLine = words.slice(3).join(" ");
    return { firstLine, secondLine };
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = Platform.select({
      ios: `maps://app?q=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
    });
    Linking.openURL(mapsUrl).catch(() => {
      // Fallback to Google Maps web URL
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      );
    });
  };
  const formatDate = (timestamp) => {
    if (!timestamp) return null; // Handle null or undefined values
    if (typeof timestamp === "string" && timestamp.length < 6) {
      return timestamp; // Return the value as is if its length is greater than 5
    }
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
    return null;
  };

  const MemberModal = () => {
    if (!selectedMember) return null;

    const [modalMember, setModalMember] = useState({});
    const [loadingMemberSingle, setLoadingMemberSingle] = useState(false);

    const fetchMemberSingular = async () => {
      setLoadingMemberSingle(true);
      let query = supabase
        .from("members")
        .select("*")
        .eq('id', selectedMember.id)

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching member:", error);
        setModalMember({});
      }
      setModalMember(data[0]);
      setLoadingMemberSingle(false);
    };

    useEffect(() => {
      console.log('fetch single')
      fetchMemberSingular()
    }, [])

    const InfoRow = ({ icon, text }) => (
      <View style={styles.infoRow}>
        <Ionicons name={icon} size={20} color="#666" style={styles.infoIcon} />
        <Text style={[styles.infoText, styles.infoTextWithIcon]}>{text}</Text>
      </View>
    );

    const formatClubName = (name) => {
      const words = name.split(" ");
      const firstLine = words.slice(0, 3).join(" ");
      const secondLine = words.slice(3).join(" ");
      return { firstLine, secondLine };
    };

    const handleWebsite = (url) => {
      if (!url.startsWith("http")) {
        url = "https://" + url;
      }
      Linking.openURL(url);
    };

    const clubName = formatClubName(selectedMember.club_name);

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
            >
              <Image
                source={{ uri: selectedMember.photograph }}
                style={styles.modalImage}
                defaultSource={require("../../../assets/images/rotary_logo.png")}
              />
              <Text style={styles.modalName}>{selectedMember.name}</Text>
              <View style={styles.clubNameContainer}>
                {clubName.firstLine && (
                  <Text style={styles.modalClubName}>{clubName.firstLine}</Text>
                )}
                {clubName.secondLine && clubName.secondLine !== "NA" && (
                  <Text style={styles.modalClubName}>
                    {clubName.secondLine}
                  </Text>
                )}
              </View>

              <View style={styles.modalSeparator} />

              <View
                style={[
                  styles.actionButtonsTop,
                  { textTransform: "capitalize" },
                ]}
              >
                {selectedMember.phone && selectedMember.phone !== "NA" && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleCall(parseInt(selectedMember.phone))}
                  >
                    <Ionicons name="call" size={24} color="#A32638" />
                  </TouchableOpacity>
                )}
                {selectedMember.email && selectedMember.email !== "NA" && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleEmail(selectedMember.email)}
                  >
                    <Ionicons name="mail" size={24} color="#A32638" />
                  </TouchableOpacity>
                )}
                {selectedMember.business_address &&
                  selectedMember.business_address !== "NA" && (
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() =>
                        handleMaps(selectedMember.business_address)
                      }
                    >
                      <Ionicons name="location" size={24} color="#A32638" />
                    </TouchableOpacity>
                  )}
              </View>

              {modalMember.emergency_contact_phone &&
                modalMember.emergency_contact_phone !== "NA" && (
                  <TouchableOpacity
                    style={styles.emergencyButton}
                    onPress={() =>
                      handleCall(
                        parseInt(modalMember.emergency_contact_phone)
                      )
                    }
                  >
                    <Text style={styles.emergencyText}>Emergency</Text>
                  </TouchableOpacity>
                )}

              {modalMember.rotarian_since &&
                modalMember.rotarian_since !== "NA" && (
                  <Text style={styles.sectionTitle}>Rotary</Text>
                )}
              {/* Rotary Information */}
              {modalMember.rotarian_since &&
                modalMember.rotarian_since !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="ribbon" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {selectedMember.affiliation}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="ribbon" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {selectedMember.sets_designation}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Image
                        source={require("../../../assets/images/cheer_icon.png")}
                        style={[styles.rotaryIcon, { tintColor: "#A32638" }]}
                      />
                      <Text style={styles.infoText}>
                        {modalMember.rotarian_since}
                      </Text>
                    </View>
                    {modalMember.rotary_foundation_title &&
                      modalMember.rotary_foundation_title !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="ribbon" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {modalMember.rotary_foundation_title}
                          </Text>
                        </View>
                      )}
                  </View>
                )}

              <View style={styles.sectionSeparator} />

              {/* Business Information */}
              {modalMember.company_name &&
                modalMember.company_name !== "NA" && (
                  <Text style={styles.sectionTitle}>Business</Text>
                )}
              {modalMember.company_name &&
                modalMember.company_name !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="business" size={20} color="#A32638" />
                      <Text
                        style={[
                          styles.infoText,
                          { fontFamily: "Inter_600SemiBold" },
                        ]}
                      >
                        {modalMember.company_name}
                      </Text>
                    </View>
                    {modalMember.designation &&
                      modalMember.designation !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="person-circle"
                            size={20}
                            color="#fff"
                          />
                          <Text
                            style={[
                              styles.infoText,
                              { fontFamily: "Inter_600SemiBold" },
                            ]}
                          >
                            {modalMember.designation}
                          </Text>
                        </View>
                      )}
                    {modalMember.type_of_business &&
                      modalMember.type_of_business !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="briefcase" size={20} color="#fff" />
                          <Text style={styles.infoText}>
                            {modalMember.type_of_business}
                          </Text>
                        </View>
                      )}
                    {modalMember.company_sector &&
                      modalMember.company_sector !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="layers" size={20} color="#fff" />
                          <Text style={styles.infoText}>
                            {modalMember.company_sector}
                          </Text>
                        </View>
                      )}
                    {modalMember.about_your_business &&
                      modalMember.about_your_business !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="information-circle"
                            size={20}
                            color="#fff"
                          />
                          <Text style={styles.infoText}>
                            {modalMember.about_your_business}
                          </Text>
                        </View>
                      )}
                    {selectedMember.business_address &&
                      selectedMember.business_address !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="location" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {selectedMember.business_address}
                          </Text>
                        </View>
                      )}
                    {modalMember.business_website &&
                      modalMember.business_website !== "NA" && (
                        <TouchableOpacity
                          style={styles.infoRow}
                          onPress={() =>
                            handleWebsite(modalMember.business_website)
                          }
                        >
                          <Ionicons name="globe" size={20} color="#A32638" />
                          <Text style={[styles.infoText, styles.linkText]}>
                            {modalMember.business_website}
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                )}

              <View style={styles.sectionSeparator} />

              {/* Personal Information */}
              {modalMember.sex && modalMember.sex !== "NA" && (
                <Text style={styles.sectionTitle}>Personal</Text>
              )}
              {modalMember.sex && modalMember.sex !== "NA" && (
                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person" size={20} color="#A32638" />
                    <Text style={styles.infoText}>{modalMember.sex}</Text>
                  </View>
                  {modalMember.spouses_name &&
                    modalMember.spouses_name !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="heart" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {modalMember.spouses_name}
                        </Text>
                      </View>
                    )}
                  {modalMember.wedding_anniversary &&
                    modalMember.wedding_anniversary !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="gift" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {formatDate(modalMember.wedding_anniversary)}
                        </Text>
                      </View>
                    )}
                  {modalMember.date_of_birth &&
                    modalMember.date_of_birth !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {formatDate(modalMember.date_of_birth)}
                        </Text>
                      </View>
                    )}
                  {modalMember.residential_address &&
                    modalMember.residential_address !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="home" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {modalMember.residential_address}
                        </Text>
                      </View>
                    )}
                </View>
              )}

              <View style={styles.sectionSeparator} />

              {/* Emergency Contact */}
              {modalMember.emergency_contact_name &&
                modalMember.emergency_contact_name !== "NA" && (
                  <Text style={styles.sectionTitle}>Emergency Contact</Text>
                )}
              {modalMember.emergency_contact_name &&
                modalMember.emergency_contact_name !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="alert-circle" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {modalMember.emergency_contact_name}
                      </Text>
                    </View>
                    {modalMember.emergency_contact_relationship &&
                      modalMember.emergency_contact_relationship !==
                      "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="people" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {modalMember.emergency_contact_relationship}
                          </Text>
                        </View>
                      )}
                    {modalMember.emergency_contact_phone &&
                      modalMember.emergency_contact_phone !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="call" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {parseInt(modalMember.emergency_contact_phone)}
                          </Text>
                        </View>
                      )}
                  </View>
                )}

              <View style={styles.sectionSeparator} />

              {/* Preferences */}
              {modalMember.shirt_size &&
                modalMember.shirt_size !== "NA" && (
                  <Text style={styles.sectionTitle}>Preferences</Text>
                )}
              {modalMember.shirt_size &&
                modalMember.shirt_size !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="shirt" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {modalMember.shirt_size}
                      </Text>
                    </View>
                    {modalMember.t_shirt_size &&
                      modalMember.t_shirt_size !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="shirt-outline"
                            size={20}
                            color="#A32638"
                          />
                          <Text style={styles.infoText}>
                            {modalMember.t_shirt_size}
                          </Text>
                        </View>
                      )}
                    {modalMember.meal_preference &&
                      modalMember.meal_preference !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="restaurant"
                            size={20}
                            color="#A32638"
                          />
                          <Text style={styles.infoText}>
                            {modalMember.meal_preference}
                          </Text>
                        </View>
                      )}
                  </View>
                )}

                {loadingMemberSingle && <ActivityIndicator />}

            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberContainer}>
      <TouchableOpacity
        onPress={() => {
          setSelectedMember(item);
          setModalVisible(true);
          console.log(item, modalVisible);
        }}
      >
        <View style={styles.memberCard}>
          <View style={styles.memberMeta}>
            <Text style={styles.memberSetsTitle}>{item.sets_designation}</Text>
            <Text style={styles.memberType}>{item.affiliation}</Text>
          </View>
          <View style={styles.memberContent}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberTitle}>
                {formatClubName(item.club_name).firstLine}
              </Text>
              <Text style={styles.memberTitle}>
                {formatClubName(item.club_name).secondLine}
              </Text>
            </View>
            <Image
              source={{ uri: item.photograph }}
              style={styles.memberImage}
            />
          </View>
          <View style={styles.actionButtonsTop}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleCall(item.phone)}
            >
              <Ionicons name="call" size={24} color="#A32638" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleEmail(item.email)}
            >
              <Ionicons name="mail" size={24} color="#A32638" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleMaps(item.business_address)}
            >
              <Ionicons name="location" size={24} color="#A32638" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <MemberModal />

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
        <Text style={styles.headerText}>SETS Team</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search a name, club or business"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={support}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={() =>
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // actionButtonsTop: {
  //   flexDirection: "row",
  //   marginTop: 15,
  //   marginHorizontal: "20%",
  //   justifyContent: "space-between",
  //   backgroundColor: "red",
  //   marginBottom: 5,
  // },
  actionButtonsTop: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 0,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  memberCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 5,
  },
  // memberContent: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },
  memberContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  // memberInfo: {
  //   flex: 1,
  //   justifyContent: "space-between",
  //   marginRight: 10,
  // },
  memberInfo: {
    flex: 1,
  },
  memberSetsTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 5,
    textTransform: "uppercase",
    color: "#A32638",
  },
  memberTitle: {
    fontSize: 12.5,
    fontFamily: "Inter_500Regular",
  },
  memberName: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  // memberMeta: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginTop: 10,
  // },
  memberMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  memberType: {
    fontSize: 13,
    color: "#A32638",
    fontFamily: "Inter_600SemiBold",
  },
  memberVenue: {
    fontSize: 12.5,
    color: "#666",
  },
  memberImage: {
    width: 75,
    height: 75,
    borderRadius: 75,
    borderColor: "#666",
    resizeMode: "cover",
    // borderWidth: 1,
    marginLeft: 12,
  },
  memberContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  listContainer: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 100,
    //marginTop: -25,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24, // Adjust size for different levels of headings
    fontFamily: "Inter_600SemiBold",
    color: "#333", // Choose your desired color
    textAlign: "center", // Optional: Center align text
    marginBottom: 16, // Optional: Add some spacing below the heading
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 10,
    width: 20,
  },
  infoTextWithIcon: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#A32638",
    marginBottom: 10,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  sectionSeparator: {
    height: 20, // Increased from 15 to accommodate titles
  },
  infoSection: {
    paddingHorizontal: 5, // Adjusted padding to align with section title
  },
  rotaryIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  linkText: {
    color: "#A32638",
    textDecorationLine: "underline",
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
    paddingVertical: 10,
    width: "85%",
    maxHeight: "80%",
    elevation: 8,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 5,
  },
  clubNameContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  modalClubName: {
    fontSize: 16,
    color: "#17458F",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#17458F",
    width: "25%",
    alignSelf: "center",
    marginBottom: 15,
  },
  actionButtonsTop: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 15,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  addressButton: {
    backgroundColor: "#17458F",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  addressButtonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_500Medium",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  callButton: {
    backgroundColor: "#4CAF50",
  },
  emailButton: {
    backgroundColor: "#2196F3",
  },
  emergencyButton: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#A32638",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  emergencyText: {
    color: "#A32638",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  actionButtonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
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
  headerText: {
    fontSize: 26,
    padding: 10,
    paddingHorizontal: 20,
    color: "#FFBD1B",
    fontFamily: "Inter_500Medium",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 15,
    paddingTop: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    zIndex: 1,
  },
  searchBox: {
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontFamily: "Inter_400Regular",
  },
  filterButton: {
    backgroundColor: "#A32638",
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontFamily: "Inter_500Medium",
  },
  grid: {
    flex: 1,
    padding: 10,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  gridItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    textAlign: "center",
    marginBottom: 10,
  },
  clubName: {
    fontSize: 13,
    color: "#17458F",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#17458F",
    width: "100%",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  businessType: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Inter_500Regular",
    textAlign: "center",
  },
});
