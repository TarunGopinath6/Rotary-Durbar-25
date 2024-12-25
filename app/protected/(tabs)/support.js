import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  writeBatch,
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

import { db, auth } from "@/firebaseConfig";

export default function Support() {
  const [support, setSupport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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

  const fetchSupport = async (startDoc = null, reset = false) => {
    setLoading(true);

    if (reset) {
      setSupport([]);
      setLastVisibleDoc(null);
    }

    try {
      const supportRef = collection(db, "users");
      let q = query(
        supportRef,
        where("role", "not-in", ["admin"]),
        where("support", "==", true),
        orderBy("name", "asc"),
        limit(PAGE_SIZE)
      );

      if (startDoc) {
        q = query(
          supportRef,
          where("role", "not-in", ["admin"]),
          where("support", "==", true),
          orderBy("name", "asc"),
          startAfter(startDoc),
          limit(PAGE_SIZE)
        );
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length < PAGE_SIZE) {
        setLastVisibleDoc(null); // No more documents to fetch
      }

      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        // Update last visible document or null if no more documents
        setLastVisibleDoc(
          querySnapshot.docs.length < PAGE_SIZE ? null : lastDoc
        );

        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data(); // Get the full document data

          // Return only the required fields along with the document ID
          return {
            id: doc.id,
            name: docData.name,
            sets_designation: docData.sets_designation,
            designation: docData.designation,
            affiliation: docData.affiliation,
            // photograph: docData.photograph,
            club_name: docData.club_name,
            business_address: docData.business_address,
            email: docData.email,
            phone: docData.phone,
          };
        });

        setSupport((prevSupport) => {
          const newIds = new Set(prevSupport.map((item) => item.id));
          const filteredData = data.filter((item) => !newIds.has(item.id));
          return [...prevSupport, ...filteredData];
        });
      } else {
        setLastVisibleDoc(null); // No more documents to fetch
      }
    } catch (error) {
      console.error("Error fetching support:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!lastVisibleDoc) {
      console.log("No more data");
      return;
    }
    fetchSupport(lastVisibleDoc);
  };

  const addRandomSupport = async () => {
    setLoading(true);

    const randomName = `User_${Math.floor(Math.random() * 1000)}`;
    const randomAffiliation = `Affiliation_${Math.floor(Math.random() * 100)}`;
    const randomDesignation = `Committee/Doctor of ${Math.floor(
      Math.random() * 100
    )}`;
    const randomSpouse = `Spouse_${Math.floor(Math.random() * 100)}`;
    const randomPhone = `+1-${Math.floor(Math.random() * 1000000000)}`;
    const randomEmail = `${randomName}@app.com`;
    const randomAddress = `Address ${Math.floor(Math.random() * 1000)}`;
    const randomCompanyName = `Company_${Math.floor(Math.random() * 100)}`;
    const randomCompanySector = `Sector_${Math.floor(Math.random() * 10)}`;
    const randomCompanyDescription = `Description of ${randomCompanyName}`;
    const randomCompanyEmail = `${randomCompanyName}@company.com`;
    const randomCompanyAddress = `Company Address ${Math.floor(
      Math.random() * 100
    )}`;
    const randomMemberSince = new Date().toISOString();
    const randomDateOfBirth = new Date(
      1980 + Math.floor(Math.random() * 40),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    ).toISOString();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        randomEmail,
        randomName
      );
      const user = userCredential.user;

      // Now, add the user details to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: randomName,
        role: "member",
        support: true,
        affiliation: randomAffiliation,
        designation: randomDesignation,
        spouse: randomSpouse,
        support_since: randomMemberSince,
        date_of_birth: randomDateOfBirth,
        phone: randomPhone,
        email: randomEmail,
        address: randomAddress,
        company_name: randomCompanyName,
        company_sector: randomCompanySector,
        company_description: randomCompanyDescription,
        company_email: randomCompanyEmail,
        company_address: randomCompanyAddress,
      });

      console.log("Random support added:", randomName);
      fetchSupport(null, true);
    } catch (error) {
      console.error("Error adding random support:", error);
    }
    setLoading(false);
  };

  const updateSupport = async (id) => {
    setLoading(true);

    const randomDesignation = `Committee/Doctor of ${Math.floor(
      Math.random() * 100
    )}`;
    try {
      const supportDoc = doc(db, "users", id);
      await updateDoc(supportDoc, { designation: randomDesignation });
      fetchSupport(null, true);
    } catch (error) {
      console.error("Error updating support:", error);
    }

    setLoading(false);
  };

  const deleteSupport = async (id) => {
    setLoading(true);

    try {
      const supportDoc = doc(db, "users", id);
      await deleteDoc(supportDoc);

      fetchSupport(null, true);
    } catch (error) {
      console.error("Error deleting support:", error);
    }

    setLoading(false);
  };

  const showMoreInfo = async (id) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        alert("Check console");
        console.log(userDoc.data());
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }

    setLoading(false);
  };

  const batchDeleteCollection = async () => {
    const collectionPath = "users";
    const batchSize = 500;

    setLoading(true);

    const collectionRef = collection(db, collectionPath);
    const q = query(
      collectionRef,
      where("role", "not-in", ["admin"]),
      where("support", "==", true),
      orderBy("name", "asc")
    );

    let totalDeleted = 0;
    let documentsToDelete = [];

    try {
      // Get all documents in the collection
      const querySnapshot = await getDocs(q);

      // Create batches of document references to delete
      for (const doc of querySnapshot.docs) {
        documentsToDelete.push(doc.ref);

        // When we reach the batch size, execute the batch delete
        if (documentsToDelete.length === batchSize) {
          await executeDelete(documentsToDelete);
          totalDeleted += documentsToDelete.length;
          documentsToDelete = [];
        }
      }

      // Delete any remaining documents
      if (documentsToDelete.length > 0) {
        await executeDelete(documentsToDelete);
        totalDeleted += documentsToDelete.length;
      }

      console.log(
        `Successfully deleted ${totalDeleted} documents from ${collectionPath}`
      );
    } catch (error) {
      console.error("Error deleting collection:", error);
    }

    setLoading(false);
    fetchSupport(null, true);
  };

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

    const handleCall = (phoneNumber) => {
      Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmail = (email) => {
      Linking.openURL(`mailto:${email}`);
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
            >
              <Image
                source={{ uri: selectedMember.photograph }}
                style={styles.modalImage}
                defaultSource={require("../../../assets/images/rotary_logo.png")}
              />
              <Text style={styles.modalName}>{selectedMember.name}</Text>
              <View style={styles.clubNameContainer}>
                <Text style={styles.modalClubName}>{clubName.firstLine}</Text>
                {clubName.secondLine && (
                  <Text style={styles.modalClubName}>
                    {clubName.secondLine}
                  </Text>
                )}
              </View>

              <View style={styles.modalSeparator} />

              <View style={styles.actionButtonsTop}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleCall(selectedMember.phone)}
                >
                  <Ionicons name="call" size={24} color="#A32638" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEmail(selectedMember.email)}
                >
                  <Ionicons name="mail" size={24} color="#A32638" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleMaps(selectedMember.business_address)}
                >
                  <Ionicons name="location" size={24} color="#A32638" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() =>
                  handleCall(selectedMember.emergency_contact_phone)
                }
              >
                <Text style={styles.emergencyText}>Emergency</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Rotary</Text>
              {/* Rotary Information */}
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

              <View style={styles.sectionSeparator} />

              {/* Business Information */}
              <Text style={styles.sectionTitle}>Business</Text>
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
                <View style={styles.infoRow}>
                  <Ionicons name="person-circle" size={20} color="#fff" />
                  <Text
                    style={[
                      styles.infoText,
                      { fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {selectedMember.designation}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase" size={20} color="#fff" />
                  <Text style={styles.infoText}>
                    {selectedMember.type_of_business}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="layers" size={20} color="#fff" />
                  <Text style={styles.infoText}>
                    {selectedMember.company_sector}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="information-circle" size={20} color="#fff" />
                  <Text style={styles.infoText}>
                    {selectedMember.about_your_business}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.business_address}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.infoRow}
                  onPress={() => handleWebsite(selectedMember.business_website)}
                >
                  <Ionicons name="globe" size={20} color="#A32638" />
                  <Text style={[styles.infoText, styles.linkText]}>
                    {selectedMember.business_website}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sectionSeparator} />

              {/* Personal Information */}
              <Text style={styles.sectionTitle}>Personal</Text>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={20} color="#A32638" />
                  <Text style={styles.infoText}>{selectedMember.sex}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="heart" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.spouses_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="gift" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.wedding_anniversary}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {/* {selectedMember.date_of_birth} */}
                    11/04/1974
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="home" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.residential_address}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionSeparator} />

              <Text style={styles.sectionTitle}>Emergency Contact</Text>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="alert-circle" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.emergency_contact_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="people" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.emergency_contact_relationship}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.emergency_contact_phone}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionSeparator} />

              <Text style={styles.sectionTitle}>Preferences</Text>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="shirt" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.shirt_size}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="shirt-outline" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.t_shirt_size}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="restaurant" size={20} color="#A32638" />
                  <Text style={styles.infoText}>
                    {selectedMember.meal_preference}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberContainer}>
      <TouchableOpacity
      // onPress={() => {
      //   setSelectedmember(item);
      //   setModalVisible(true);
      // }}
      >
        <View style={styles.memberCard}>
          <View style={styles.memberContent}>
            <View style={styles.memberInfo}>
              <View style={styles.memberMeta}>
                <Text style={styles.memberSetsTitle}>
                  {item.sets_designation}
                </Text>
                <Text style={styles.memberType}>{item.affiliation}</Text>
              </View>
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

  async function executeDelete(documentRefs) {
    const batch = writeBatch(db);

    documentRefs.forEach((docRef) => {
      batch.delete(docRef);
    });

    await batch.commit();
  }

  useEffect(() => {
    fetchSupport();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Support</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (support.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Support</Text>
        <View style={styles.buttonContainer}>
          <Button title="Refresh" onPress={() => fetchSupport(null, true)} />
          <Button title="Add Support" onPress={addRandomSupport} />
        </View>
        <Text>No support found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/mysore_palace.png")}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>SETS Team</Text>
      </View>

      {/* <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={() => fetchSupport(null, true)} />
        <Button title="Add Support" onPress={addRandomSupport} />
        <Button
          title="Delete All"
          onPress={batchDeleteCollection}
          color="red"
        />
      </View> */}
      <View style={styles.listContainer}>
        <FlatList
          data={support}
          keyExtractor={(item) => item.id}
          // renderItem={({ item }) => (
          //   <View style={styles.card}>
          //     <Text style={styles.title}>{item.title}</Text>
          //     <Text>Name: {item.name}</Text>
          //     <Text>affiliation: {item.affiliation}</Text>
          //     <Text>designation: {item.designation}</Text>

          //     <View style={[styles.buttonContainer, { marginTop: 20 }]}>
          //       <Button
          //         title="Update"
          //         onPress={() => updateSupport(item.id)}
          //         color="blue"
          //       />
          //       <Button
          //         title="Show More Info"
          //         onPress={() => showMoreInfo(item.id)}
          //         color="green"
          //       />
          //       <Button
          //         title="Delete"
          //         onPress={() => deleteSupport(item.id)}
          //         color="red"
          //       />
          //     </View>
          //   </View>
          // )}
          renderItem={renderMember}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        {lastVisibleDoc && <Button onPress={loadMoreData} title="Load More" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtonsTop: {
    flexDirection: "row",
    marginTop: 15,
    marginHorizontal: 50,
    justifyContent: "space-between",
    marginBottom: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 5,
  },
  memberContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  memberInfo: {
    flex: 1,
    justifyContent: "space-between",
    marginRight: 10,
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
  memberMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  listContainer: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    zIndex: 1,
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
});
