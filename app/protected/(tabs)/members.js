import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Linking,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
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

const DirectoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offsetDoc, setOffsetDoc] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 16;

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

  const fetchMembers = async (offset = 0, queryText = "") => {
    let query = supabase
      .from("members")
      .select("*")
      .order("name", { ascending: true }) // Adjust the column for sorting as needed
      .range(offset, offset + PAGE_SIZE - 1);

    if (queryText) {
      query = query.or(
        `name.ilike.%${queryText}%,company_name.ilike.%${queryText}%,club_name.ilike.%${queryText}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching members:", error);
      return [];
    }
    return data;
  };

  const loadMembers = async (reset = false, queryText = "") => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);

    console.log("searching", queryText, offsetDoc);
    let response = null;

    if (reset) {
      response = await fetchMembers(0, queryText);
      setMembers(response);
      setOffsetDoc(response.length);
    } else {
      response = await fetchMembers(offsetDoc, queryText);
      setMembers((prev) => [...prev, ...response]);
      setOffsetDoc(offsetDoc + response.length);
    }

    if (response.length < 10) {
      setHasMore(false); // No more data if fewer than limit records are returned
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMembers(true);
  }, []);

  useEffect(() => {
    // handleSearch(searchQuery);
    loadMembers(true, searchQuery);
  }, [searchQuery]);

  // Sample data - replace with your actual data source
  // const directoryData = [
  //   {
  //     about_your_business:
  //       "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
  //     business_address: "Chennai",
  //     business_website: "www.configusa.com",
  //     club_name: "Rotary Club Of Madras Chenna Patna",
  //     company_name: "Config Solutions Private Limited ",
  //     date_of_birth: "11/04/1974",
  //     designation: "Director",
  //     email: "rcantony@gmail.com",
  //     email_address: "rcantony@gmail.com",
  //     emergency_contact_name: "Mariaselvi",
  //     emergency_contact_phone: 9962882591,
  //     emergency_contact_relationship: "Spouse",
  //     meal_preference: "Non-Vegetarian",
  //     name: "Antony Kumar RC",
  //     phone: 9840960300,
  //     photograph:
  //       "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
  //     residential_address:
  //       "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
  //     role: "member",
  //     rotarian_since: 2023,
  //     rotary_foundation_title: "Paul Harris Fellow (PHF)",
  //     sex: "Male",
  //     shirt_size: 42,
  //     spouses_name: "Mariaselvi",
  //     support: false,
  //     t_shirt_size: "XL",
  //     type_of_business: "Professional Services",
  //     wedding_anniversary: "28/05",
  //     name: "Antony Kumar RC",
  //     company_sector: "IT Services",
  //     business_name: "Config Solutions Private Limited",
  //   },
  //   {
  //     about_your_business:
  //       "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
  //     business_address: "Chennai",
  //     business_website: "www.configusa.com",
  //     club_name: "Rotary Club Of Madras Chenna Patna",
  //     company_name: "Config Solutions Private Limited ",
  //     date_of_birth: { nanoseconds: 0, seconds: 134870400 },
  //     designation: "Director",
  //     email: "rcantony@gmail.com",
  //     email_address: "rcantony@gmail.com",
  //     emergency_contact_name: "Mariaselvi",
  //     emergency_contact_phone: 9962882591,
  //     emergency_contact_relationship: "Spouse",
  //     meal_preference: "Non-Vegetarian",
  //     name: "Antony Kumar RC",
  //     phone: 9840960300,
  //     photograph:
  //       "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
  //     residential_address:
  //       "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
  //     role: "member",
  //     rotarian_since: 2023,
  //     rotary_foundation_title: "Paul Harris Fellow (PHF)",
  //     sex: "Male",
  //     shirt_size: 42,
  //     spouses_name: "Mariaselvi",
  //     support: false,
  //     t_shirt_size: "XL",
  //     type_of_business: "Professional Services",
  //     wedding_anniversary: "28/05",
  //     name: "Antony Kumar RC",
  //     company_sector: "IT Services",
  //   },
  //   {
  //     about_your_business:
  //       "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
  //     business_address: "Chennai",
  //     business_website: "www.configusa.com",
  //     club_name: "Rotary Club Of Madras Chenna Patna",
  //     company_name: "Config Solutions Private Limited ",
  //     date_of_birth: { nanoseconds: 0, seconds: 134870400 },
  //     designation: "Director",
  //     email: "rcantony@gmail.com",
  //     email_address: "rcantony@gmail.com",
  //     emergency_contact_name: "Mariaselvi",
  //     emergency_contact_phone: 9962882591,
  //     emergency_contact_relationship: "Spouse",
  //     meal_preference: "Non-Vegetarian",
  //     name: "Antony Kumar RC",
  //     phone: 9840960300,
  //     photograph:
  //       "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
  //     residential_address:
  //       "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
  //     role: "member",
  //     rotarian_since: 2023,
  //     rotary_foundation_title: "Paul Harris Fellow (PHF)",
  //     sex: "Male",
  //     shirt_size: 42,
  //     spouses_name: "Mariaselvi",
  //     support: false,
  //     t_shirt_size: "XL",
  //     type_of_business: "Professional Services",
  //     wedding_anniversary: "28/05",
  //     name: "Antony Kumar RC",
  //     company_sector: "IT Services",
  //   },
  //   {
  //     about_your_business:
  //       "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
  //     business_address: "Chennai",
  //     business_website: "www.configusa.com",
  //     club_name: "Rotary Club Of Madras Chenna Patna",
  //     company_name: "Config Solutions Private Limited ",
  //     date_of_birth: { nanoseconds: 0, seconds: 134870400 },
  //     designation: "Director",
  //     email: "rcantony@gmail.com",
  //     email_address: "rcantony@gmail.com",
  //     emergency_contact_name: "Mariaselvi",
  //     emergency_contact_phone: 9962882591,
  //     emergency_contact_relationship: "Spouse",
  //     meal_preference: "Non-Vegetarian",
  //     name: "Antony Kumar RC",
  //     phone: 9840960300,
  //     photograph:
  //       "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
  //     residential_address:
  //       "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
  //     role: "member",
  //     rotarian_since: 2023,
  //     rotary_foundation_title: "Paul Harris Fellow (PHF)",
  //     sex: "Male",
  //     shirt_size: 42,
  //     spouses_name: "Mariaselvi",
  //     support: false,
  //     t_shirt_size: "XL",
  //     type_of_business: "Professional Services",
  //     wedding_anniversary: "28/05",
  //     name: "Antony Kumar RC",
  //     company_sector: "IT Services",
  //   },
  //   {
  //     about_your_business:
  //       "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
  //     business_address: "Chennai",
  //     business_website: "www.configusa.com",
  //     club_name: "Rotary Club Of Madras Chenna Patna",
  //     company_name: "Config Solutions Private Limited ",
  //     date_of_birth: { nanoseconds: 0, seconds: 134870400 },
  //     designation: "Director",
  //     email: "rcantony@gmail.com",
  //     email_address: "rcantony@gmail.com",
  //     emergency_contact_name: "Mariaselvi",
  //     emergency_contact_phone: 9962882591,
  //     emergency_contact_relationship: "Spouse",
  //     meal_preference: "Non-Vegetarian",
  //     name: "Antony Kumar RC",
  //     phone: 9840960300,
  //     photograph:
  //       "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
  //     residential_address:
  //       "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
  //     role: "member",
  //     rotarian_since: 2023,
  //     rotary_foundation_title: "Paul Harris Fellow (PHF)",
  //     sex: "Male",
  //     shirt_size: 42,
  //     spouses_name: "Mariaselvi",
  //     support: false,
  //     t_shirt_size: "XL",
  //     type_of_business: "Professional Services",
  //     wedding_anniversary: "28/05",
  //     name: "Antony Kumar RC",
  //     company_sector: "IT Services",
  //   },
  //   // Add more directory items here
  // ];

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

  const handleSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const filtered = directoryData.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.company_name.toLowerCase().includes(lowercaseQuery) ||
        item.club_name.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredData(filtered);
  };

  const renderDirectoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => {
        setSelectedMember(item);
        setModalVisible(true);
      }}
    >
      <Image
        source={{ uri: item.photograph }}
        style={styles.profileImage}
        //source={require("../../../assets/images/rotary_logo.png")}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.clubName}>{item.club_name}</Text>
      <View style={styles.separator} />
      <Text style={styles.companyName}>{item.company_name}</Text>
      <Text style={styles.businessType}>{item.type_of_business}</Text>
    </TouchableOpacity>
  );

  // const formatDate = (dateObj) => {
  //   if (!dateObj || !dateObj.seconds) return "01/01/1980";
  //   return new Date(dateObj.seconds * 1000).toLocaleDateString();
  // };

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

  // Add this component inside DirectoryScreen but before the return statement
  const MemberModal = () => {
    if (!selectedMember) return null;
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
                    onPress={() => handleCall(selectedMember.phone)}
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

              {selectedMember.emergency_contact_phone &&
                selectedMember.emergency_contact_phone !== "NA" && (
                  <TouchableOpacity
                    style={styles.emergencyButton}
                    onPress={() =>
                      handleCall(
                        parseFloat(selectedMember.emergency_contact_phone)
                      )
                    }
                  >
                    <Text style={styles.emergencyText}>Emergency</Text>
                  </TouchableOpacity>
                )}

              {selectedMember.rotarian_since &&
                selectedMember.rotarian_since !== "NA" && (
                  <Text style={styles.sectionTitle}>Rotary</Text>
                )}
              {/* Rotary Information */}
              {selectedMember.rotarian_since &&
                selectedMember.rotarian_since !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Image
                        source={require("../../../assets/images/cheer_icon.png")}
                        style={[styles.rotaryIcon, { tintColor: "#A32638" }]}
                      />
                      <Text style={styles.infoText}>
                        {selectedMember.rotarian_since}
                      </Text>
                    </View>
                    {selectedMember.rotary_foundation_title &&
                      selectedMember.rotary_foundation_title !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="ribbon" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {selectedMember.rotary_foundation_title}
                          </Text>
                        </View>
                      )}
                  </View>
                )}

              <View style={styles.sectionSeparator} />

              {/* Business Information */}
              {selectedMember.company_name &&
                selectedMember.company_name !== "NA" && (
                  <Text style={styles.sectionTitle}>Business</Text>
                )}
              {selectedMember.company_name &&
                selectedMember.company_name !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="business" size={20} color="#A32638" />
                      <Text
                        style={[
                          styles.infoText,
                          { fontFamily: "Inter_600SemiBold" },
                        ]}
                      >
                        {selectedMember.company_name}
                      </Text>
                    </View>
                    {selectedMember.designation &&
                      selectedMember.designation !== "NA" && (
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
                            {selectedMember.designation}
                          </Text>
                        </View>
                      )}
                    {selectedMember.type_of_business &&
                      selectedMember.type_of_business !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="briefcase" size={20} color="#fff" />
                          <Text style={styles.infoText}>
                            {selectedMember.type_of_business}
                          </Text>
                        </View>
                      )}
                    {selectedMember.company_sector &&
                      selectedMember.company_sector !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="layers" size={20} color="#fff" />
                          <Text style={styles.infoText}>
                            {selectedMember.company_sector}
                          </Text>
                        </View>
                      )}
                    {selectedMember.about_your_business &&
                      selectedMember.about_your_business !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="information-circle"
                            size={20}
                            color="#fff"
                          />
                          <Text style={styles.infoText}>
                            {selectedMember.about_your_business}
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
                    {selectedMember.business_website &&
                      selectedMember.business_website !== "NA" && (
                        <TouchableOpacity
                          style={styles.infoRow}
                          onPress={() =>
                            handleWebsite(selectedMember.business_website)
                          }
                        >
                          <Ionicons name="globe" size={20} color="#A32638" />
                          <Text style={[styles.infoText, styles.linkText]}>
                            {selectedMember.business_website}
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                )}

              <View style={styles.sectionSeparator} />

              {/* Personal Information */}
              {selectedMember.sex && selectedMember.sex !== "NA" && (
                <Text style={styles.sectionTitle}>Personal</Text>
              )}
              {selectedMember.sex && selectedMember.sex !== "NA" && (
                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person" size={20} color="#A32638" />
                    <Text style={styles.infoText}>{selectedMember.sex}</Text>
                  </View>
                  {selectedMember.spouses_name &&
                    selectedMember.spouses_name !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="heart" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {selectedMember.spouses_name}
                        </Text>
                      </View>
                    )}
                  {selectedMember.wedding_anniversary &&
                    selectedMember.wedding_anniversary !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="gift" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {formatDate(selectedMember.wedding_anniversary)}
                        </Text>
                      </View>
                    )}
                  {selectedMember.date_of_birth &&
                    selectedMember.date_of_birth !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {formatDate(selectedMember.date_of_birth)}
                        </Text>
                      </View>
                    )}
                  {selectedMember.residential_address &&
                    selectedMember.residential_address !== "NA" && (
                      <View style={styles.infoRow}>
                        <Ionicons name="home" size={20} color="#A32638" />
                        <Text style={styles.infoText}>
                          {selectedMember.residential_address}
                        </Text>
                      </View>
                    )}
                </View>
              )}

              <View style={styles.sectionSeparator} />

              {/* Emergency Contact */}
              {selectedMember.emergency_contact_name &&
                selectedMember.emergency_contact_name !== "NA" && (
                  <Text style={styles.sectionTitle}>Emergency Contact</Text>
                )}
              {selectedMember.emergency_contact_name &&
                selectedMember.emergency_contact_name !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="alert-circle" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {selectedMember.emergency_contact_name}
                      </Text>
                    </View>
                    {selectedMember.emergency_contact_relationship &&
                      selectedMember.emergency_contact_relationship !==
                        "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="people" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {selectedMember.emergency_contact_relationship}
                          </Text>
                        </View>
                      )}
                    {selectedMember.emergency_contact_phone &&
                      selectedMember.emergency_contact_phone !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons name="call" size={20} color="#A32638" />
                          <Text style={styles.infoText}>
                            {selectedMember.emergency_contact_phone}
                          </Text>
                        </View>
                      )}
                  </View>
                )}

              <View style={styles.sectionSeparator} />

              {/* Preferences */}
              {selectedMember.shirt_size &&
                selectedMember.shirt_size !== "NA" && (
                  <Text style={styles.sectionTitle}>Preferences</Text>
                )}
              {selectedMember.shirt_size &&
                selectedMember.shirt_size !== "NA" && (
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Ionicons name="shirt" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {selectedMember.shirt_size}
                      </Text>
                    </View>
                    {selectedMember.t_shirt_size &&
                      selectedMember.t_shirt_size !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="shirt-outline"
                            size={20}
                            color="#A32638"
                          />
                          <Text style={styles.infoText}>
                            {selectedMember.t_shirt_size}
                          </Text>
                        </View>
                      )}
                    {selectedMember.meal_preference &&
                      selectedMember.meal_preference !== "NA" && (
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="restaurant"
                            size={20}
                            color="#A32638"
                          />
                          <Text style={styles.infoText}>
                            {selectedMember.meal_preference}
                          </Text>
                        </View>
                      )}
                  </View>
                )}
            </ScrollView>
          </View>
        </View>
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
        <Text style={styles.headerText}>Royal Secretaries</Text>
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

      <MemberModal />

      {/* Directory Grid */}
      <FlatList
        data={members}
        renderItem={renderDirectoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        style={styles.grid}
        nestedScrollEnabled
        onEndReached={() => {
          if (hasMore) loadMembers();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default DirectoryScreen;
