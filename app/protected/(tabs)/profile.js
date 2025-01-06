import React, { useState, useContext } from "react";
import { AppContext } from "./_layout";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  TextInput,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import supabase from "@/supabase.js";


export default function Profile() {
  const { userData, headerData, setUserData } = useContext(AppContext);
  const [transactionID, setTransactionID] = useState("");

  const formatClubName = (name) => {
    const words = name.split(" ");
    const firstLine = words.slice(0, 3).join(" ");
    const secondLine = words.slice(3).join(" ");
    return { firstLine, secondLine };
  };

  const clubName = formatClubName(userData?.club_name ?? "");

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

  async function updateTransactionId() {
    try {
      // Update the transaction ID for the given member ID
      const { data: dataUpdate, error: errorUpdate } = await supabase
        .from('members') // Replace with your table name
        .update({ transaction_id: transactionID }) // Replace with your column name
        .eq('id', userData?.id); // Match the specific member_id

      if (errorUpdate) {
        throw new Error(`Error updating transaction_id: ${errorUpdate.message}`);
      }

      const { data: userDoc, error: errorRead } = await supabase
        .from('members') // Replace with your table name
        .select("*")
        .eq('id', userData?.id)
        .single();

      if (errorRead) {
        throw new Error(`Error updating transaction_id: ${errorRead.message}`);
      }

      setUserData({ id: userDoc.id, ...userDoc });
      Alert.alert('Transaction ID updated successfully')
    } catch (err) {
      console.log(err);
      Alert.alert('Failed to update transaction ID');
    }
  }

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.scrollContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Platform.OS === "ios" ? 60 : 30 },
          ]}
          bounces={true}
        >
          <Image
            source={{ uri: userData.photograph }}
            style={styles.modalImage}
            defaultSource={require("../../../assets/images/rotary_logo.png")}
          />
          <Text style={styles.modalName}>{userData.name}</Text>
          <View style={styles.clubNameContainer}>
            {clubName.firstLine && (
              <Text style={styles.modalClubName}>{clubName.firstLine}</Text>
            )}
            {clubName.secondLine && clubName.secondLine !== "NA" && (
              <Text style={styles.modalClubName}>{clubName.secondLine}</Text>
            )}
          </View>

          <View style={styles.modalSeparator} />

          <Text>{headerData?.bank_details ?? ""}</Text>
          <Text>{headerData?.upi_id ?? ""}</Text>
          <Text>Current Transaction ID: {userData?.transaction_id ?? "NA"}</Text>

          <TextInput
            placeholder="Enter Transaction ID"
            placeholderTextColor="#666"
            value={transactionID}
            onChangeText={setTransactionID}
            style={{ borderWidth: 1 }}
          />

          <TouchableOpacity
            style={{ backgroundColor: "lightblue", padding: 10 }}
            onPress={updateTransactionId}
          >
            <Text>Input Transaction ID</Text>
          </TouchableOpacity>

          <View
            style={[styles.actionButtonsTop, { textTransform: "capitalize" }]}
          >
            {userData.phone && userData.phone !== "NA" && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleCall(parseInt(userData.phone))}
              >
                <Ionicons name="call" size={24} color="#A32638" />
              </TouchableOpacity>
            )}
            {userData.email && userData.email !== "NA" && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEmail(userData.email)}
              >
                <Ionicons name="mail" size={24} color="#A32638" />
              </TouchableOpacity>
            )}
            {userData.business_address &&
              userData.business_address !== "NA" && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleMaps(userData.business_address)}
                >
                  <Ionicons name="location" size={24} color="#A32638" />
                </TouchableOpacity>
              )}
          </View>

          {userData.emergency_contact_phone &&
            userData.emergency_contact_phone !== "NA" && (
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() =>
                  handleCall(parseInt(userData.emergency_contact_phone))
                }
              >
                <Text style={styles.emergencyText}>Emergency</Text>
              </TouchableOpacity>
            )}

          {userData.rotarian_since && userData.rotarian_since !== "NA" && (
            <Text style={styles.sectionTitle}>Rotary</Text>
          )}
          {/* Rotary Information */}
          {userData.rotarian_since && userData.rotarian_since !== "NA" && (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Image
                  source={require("../../../assets/images/cheer_icon.png")}
                  style={[styles.rotaryIcon, { tintColor: "#A32638" }]}
                />
                <Text style={styles.infoText}>{userData.rotarian_since}</Text>
              </View>
              {userData.rotary_foundation_title &&
                userData.rotary_foundation_title !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons name="ribbon" size={20} color="#A32638" />
                    <Text style={styles.infoText}>
                      {userData.rotary_foundation_title}
                    </Text>
                  </View>
                )}
            </View>
          )}

          <View style={styles.sectionSeparator} />

          {/* Business Information */}
          {userData.company_name && userData.company_name !== "NA" && (
            <Text style={styles.sectionTitle}>Business</Text>
          )}
          {userData.company_name && userData.company_name !== "NA" && (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="business" size={20} color="#A32638" />
                <Text
                  style={[styles.infoText, { fontFamily: "Inter_600SemiBold" }]}
                >
                  {userData.company_name}
                </Text>
              </View>
              {userData.designation && userData.designation !== "NA" && (
                <View style={styles.infoRow}>
                  <Ionicons name="person-circle" size={20} color="#fff" />
                  <Text
                    style={[
                      styles.infoText,
                      { fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {userData.designation}
                  </Text>
                </View>
              )}
              {userData.type_of_business &&
                userData.type_of_business !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons name="briefcase" size={20} color="#fff" />
                    <Text style={styles.infoText}>
                      {userData.type_of_business}
                    </Text>
                  </View>
                )}
              {userData.company_sector && userData.company_sector !== "NA" && (
                <View style={styles.infoRow}>
                  <Ionicons name="layers" size={20} color="#fff" />
                  <Text style={styles.infoText}>{userData.company_sector}</Text>
                </View>
              )}
              {userData.about_your_business &&
                userData.about_your_business !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.infoText}>
                      {userData.about_your_business}
                    </Text>
                  </View>
                )}
              {userData.business_address &&
                userData.business_address !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color="#A32638" />
                    <Text style={styles.infoText}>
                      {userData.business_address}
                    </Text>
                  </View>
                )}
              {userData.business_website &&
                userData.business_website !== "NA" && (
                  <TouchableOpacity
                    style={styles.infoRow}
                    onPress={() => handleWebsite(userData.business_website)}
                  >
                    <Ionicons name="globe" size={20} color="#A32638" />
                    <Text style={[styles.infoText, styles.linkText]}>
                      {userData.business_website}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}

          <View style={styles.sectionSeparator} />

          {/* Personal Information */}
          {userData.sex && userData.sex !== "NA" && (
            <Text style={styles.sectionTitle}>Personal</Text>
          )}
          {userData.sex && userData.sex !== "NA" && (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#A32638" />
                <Text style={styles.infoText}>{userData.sex}</Text>
              </View>
              {userData.spouses_name && userData.spouses_name !== "NA" && (
                <View style={styles.infoRow}>
                  <Ionicons name="heart" size={20} color="#A32638" />
                  <Text style={styles.infoText}>{userData.spouses_name}</Text>
                </View>
              )}
              {userData.wedding_anniversary &&
                userData.wedding_anniversary !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons name="gift" size={20} color="#A32638" />
                    <Text style={styles.infoText}>
                      {formatDate(userData.wedding_anniversary)}
                    </Text>
                  </View>
                )}
              {userData.date_of_birth && userData.date_of_birth !== "NA" && (
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {formatDate(userData.date_of_birth)}
                  </Text>
                </View>
              )}
              {userData.residential_address &&
                userData.residential_address !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons name="home" size={20} color="#A32638" />
                    <Text style={styles.infoText}>
                      {userData.residential_address}
                    </Text>
                  </View>
                )}
            </View>
          )}

          <View style={styles.sectionSeparator} />

          {/* Emergency Contact */}
          {userData.emergency_contact_name &&
            userData.emergency_contact_name !== "NA" && (
              <Text style={styles.sectionTitle}>Emergency Contact</Text>
            )}
          {userData.emergency_contact_name &&
            userData.emergency_contact_name !== "NA" && (
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="alert-circle" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {userData.emergency_contact_name}
                  </Text>
                </View>
                {userData.emergency_contact_relationship &&
                  userData.emergency_contact_relationship !== "NA" && (
                    <View style={styles.infoRow}>
                      <Ionicons name="people" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {userData.emergency_contact_relationship}
                      </Text>
                    </View>
                  )}
                {userData.emergency_contact_phone &&
                  userData.emergency_contact_phone !== "NA" && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call" size={20} color="#A32638" />
                      <Text style={styles.infoText}>
                        {parseInt(userData.emergency_contact_phone)}
                      </Text>
                    </View>
                  )}
              </View>
            )}

          <View style={styles.sectionSeparator} />

          {/* Preferences */}
          {userData.shirt_size && userData.shirt_size !== "NA" && (
            <Text style={styles.sectionTitle}>Preferences</Text>
          )}
          {userData.shirt_size && userData.shirt_size !== "NA" && (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="shirt" size={20} color="#A32638" />
                <Text style={styles.infoText}>{userData.shirt_size}</Text>
              </View>
              {userData.t_shirt_size && userData.t_shirt_size !== "NA" && (
                <View style={styles.infoRow}>
                  <Ionicons name="shirt-outline" size={20} color="#A32638" />
                  <Text style={styles.infoText}>{userData.t_shirt_size}</Text>
                </View>
              )}
              {userData.meal_preference &&
                userData.meal_preference !== "NA" && (
                  <View style={styles.infoRow}>
                    <Ionicons name="restaurant" size={20} color="#A32638" />
                    <Text style={styles.infoText}>
                      {userData.meal_preference}
                    </Text>
                  </View>
                )}
            </View>
          )}
        </ScrollView>
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
  // scrollContent: {
  //   flex: 1,
  //   position: "absolute",
  //   paddingBottom: 20,
  //   padding: 15,
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   marginTop: -25,
  //   zIndex: 1,
  //   marginTop: 15,
  // },
  scrollContent: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    zIndex: 1,
    paddingBottom: 50,
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
