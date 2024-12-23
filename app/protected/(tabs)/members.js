// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet, Button } from "react-native";
// import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
// import { collection, getDocs, setDoc, getDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, writeBatch } from "firebase/firestore";

// import { db, auth } from "@/firebaseConfig";

// export default function Members() {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastVisibleDoc, setLastVisibleDoc] = useState(null);

//   const PAGE_SIZE = 10;

//   const fetchMembers = async (startDoc = null, reset = false) => {
//     setLoading(true);

//     if (reset) {
//       setMembers([]);
//       setLastVisibleDoc(null);
//     }

//     try {
//       const memberRef = collection(db, 'users');
//       let q = query(
//         memberRef,
//         where('role', 'not-in', ['admin',]),
//         where('support', '==', false),
//         orderBy('name', 'asc'),
//         limit(PAGE_SIZE)
//       );

//       if (startDoc) {
//         q = query(
//           memberRef,
//           where('role', 'not-in', ['admin',]),
//           where('support', '==', false),
//           orderBy('name', 'asc'),
//           startAfter(startDoc),
//           limit(PAGE_SIZE)
//         );
//       }

//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.docs.length < PAGE_SIZE) {
//         setLastVisibleDoc(null); // No more documents to fetch
//       }

//       if (!querySnapshot.empty) {
//         const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
//         // Update last visible document or null if no more documents
//         setLastVisibleDoc(querySnapshot.docs.length < PAGE_SIZE ? null : lastDoc);

//         const data = querySnapshot.docs.map((doc) => {
//           const docData = doc.data(); // Get the full document data

//           // Return only the required fields along with the document ID
//           return {
//             id: doc.id,
//             name: docData.name,
//             affiliation: docData.affiliation,
//             company_name: docData.company_name,
//             company_sector: docData.company_sector,
//           };
//         });

//         setMembers((prevMembers) => {
//           const newIds = new Set(prevMembers.map((item) => item.id));
//           const filteredData = data.filter((item) => !newIds.has(item.id));
//           return [...prevMembers, ...filteredData];
//         });
//       } else {
//         setLastVisibleDoc(null); // No more documents to fetch
//       }
//     } catch (error) {
//       console.error("Error fetching members:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMoreData = () => {
//     if (!lastVisibleDoc) {
//       console.log('No more data')
//       return;
//     }
//     fetchMembers(lastVisibleDoc);
//   };

//   const addRandomMembers = async () => {
//     setLoading(true);

//     const randomName = `User_${Math.floor(Math.random() * 1000)}`;
//     const randomAffiliation = `Affiliation_${Math.floor(Math.random() * 100)}`;
//     const randomSpouse = `Spouse_${Math.floor(Math.random() * 100)}`;
//     const randomPhone = `+1-${Math.floor(Math.random() * 1000000000)}`;
//     const randomEmail = `${randomName}@app.com`;
//     const randomAddress = `Address ${Math.floor(Math.random() * 1000)}`;
//     const randomCompanyName = `Company_${Math.floor(Math.random() * 100)}`;
//     const randomCompanySector = `Sector_${Math.floor(Math.random() * 10)}`;
//     const randomCompanyDescription = `Description of ${randomCompanyName}`;
//     const randomCompanyEmail = `${randomCompanyName}@company.com`;
//     const randomCompanyAddress = `Company Address ${Math.floor(Math.random() * 100)}`;
//     const randomMemberSince = new Date().toISOString();
//     const randomDateOfBirth = new Date(1980 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString();

//     try {
//       // Create user in Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(auth, randomEmail, randomName);
//       const user = userCredential.user;

//       // Now, add the user details to Firestore
//       const userRef = doc(db, 'users', user.uid);
//       await setDoc(userRef, {
//         name: randomName,
//         role: 'member', // Assuming 'member' as a role for simplicity
//         support: false,
//         affiliation: randomAffiliation,
//         spouse: randomSpouse,
//         member_since: randomMemberSince,
//         date_of_birth: randomDateOfBirth,
//         phone: randomPhone,
//         email: randomEmail,
//         address: randomAddress,
//         company_name: randomCompanyName,
//         company_sector: randomCompanySector,
//         company_description: randomCompanyDescription,
//         company_email: randomCompanyEmail,
//         company_address: randomCompanyAddress,
//       });

//       console.log('Random member added:', randomName);
//       fetchMembers(null, true)
//     } catch (error) {
//       console.error('Error adding random member:', error);
//     }
//     setLoading(false);

//   };

//   const updateMembers = async (id) => {
//     setLoading(true);

//     const randomCompany = `Comapny_${Math.random().toFixed(3)}`;
//     try {
//       const memberDoc = doc(db, "users", id);
//       await updateDoc(memberDoc, { company_name: randomCompany });
//       fetchMembers(null, true)
//     } catch (error) {
//       console.error("Error updating member:", error);
//     }

//     setLoading(false);
//   };

//   const deleteMembers = async (id) => {
//     setLoading(true);

//     try {
//       const memberDoc = doc(db, "users", id);
//       await deleteDoc(memberDoc);

//       fetchMembers(null, true)
//     } catch (error) {
//       console.error("Error deleting member:", error);
//     }

//     setLoading(false);
//   };

//   const showMoreInfo = async (id) => {
//     setLoading(true);
//     try {
//       const userRef = doc(db, "users", id);
//       const userDoc = await getDoc(userRef);

//       if (userDoc.exists()) {
//         alert('Check console')
//         console.log(userDoc.data())
//       } else {
//         console.log("No such user!");
//       }
//     } catch (error) {
//       console.error("Error fetching user data: ", error);
//     }

//     setLoading(false);

//   }

//   const batchDeleteCollection = async () => {
//     const collectionPath = "users"
//     const batchSize = 500;

//     setLoading(true);

//     const collectionRef = collection(db, collectionPath);
//     const q = query(
//       collectionRef,
//       where('role', 'not-in', ['admin',]),
//       where('support', '==', false),
//       orderBy('name', 'asc')
//     );

//     let totalDeleted = 0;
//     let documentsToDelete = [];

//     try {
//       // Get all documents in the collection
//       const querySnapshot = await getDocs(q);

//       // Create batches of document references to delete
//       for (const doc of querySnapshot.docs) {
//         documentsToDelete.push(doc.ref);

//         // When we reach the batch size, execute the batch delete
//         if (documentsToDelete.length === batchSize) {
//           await executeDelete(documentsToDelete);
//           totalDeleted += documentsToDelete.length;
//           documentsToDelete = [];
//         }
//       }

//       // Delete any remaining documents
//       if (documentsToDelete.length > 0) {
//         await executeDelete(documentsToDelete);
//         totalDeleted += documentsToDelete.length;
//       }

//       console.log(`Successfully deleted ${totalDeleted} documents from ${collectionPath}`);

//     } catch (error) {
//       console.error('Error deleting collection:', error);
//     }

//     setLoading(false);
//     fetchMembers(null, true);
//   }

//   async function executeDelete(documentRefs) {
//     const batch = writeBatch(db);

//     documentRefs.forEach(docRef => {
//       batch.delete(docRef);
//     });

//     await batch.commit();
//   }

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.heading}>Members</Text>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (members.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.heading}>Members</Text>
//         <View style={styles.buttonContainer}>
//           <Button title="Refresh" onPress={() => fetchMembers(null, true)} />
//           <Button title="Add Random Member" onPress={addRandomMembers} />
//         </View>
//         <Text>No members found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mainContainer}>
//       <Text style={styles.heading}>Members</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Refresh" onPress={() => fetchMembers(null, true)} />
//         <Button title="Add Random Member" onPress={addRandomMembers} />
//         <Button
//           title="Delete All"
//           onPress={batchDeleteCollection}
//           color="red"
//         />
//       </View>

//       <FlatList
//         data={members}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>

//             <Text style={styles.title}>{item.title}</Text>
//             <Text>Name: {item.name}</Text>
//             <Text>affiliation: {item.affiliation}</Text>
//             <Text>Comapny Name: {item.company_name}</Text>
//             <Text>Comapny Sector: {item.company_sector}</Text>

//             <View style={[styles.buttonContainer, { marginTop: 20 }]}>
//               <Button
//                 title="Update"
//                 onPress={() => updateMembers(item.id)}
//                 color="blue"
//               />
//               <Button
//                 title="Show More Info"
//                 onPress={() => showMoreInfo(item.id)}
//                 color="green"
//               />
//               <Button
//                 title="Delete"
//                 onPress={() => deleteMembers(item.id)}
//                 color="red"
//               />
//             </View>
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//       {lastVisibleDoc && <Button onPress={loadMoreData} title="Load More" />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     flexGrow: 1,
//     flex: 1,
//     padding: 16
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   heading: {
//     fontSize: 24, // Adjust size for different levels of headings
//     fontWeight: 'bold', // Make it bold to distinguish as a heading
//     color: '#333', // Choose your desired color
//     textAlign: 'center', // Optional: Center align text
//     marginBottom: 16, // Optional: Add some spacing below the heading
//   },
//   card: {
//     marginBottom: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const DirectoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Sample data - replace with your actual data source
  const directoryData = [
    {
      about_your_business:
        "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
      business_address: "Chennai",
      business_website: "www.configusa.com",
      club_name: "Rotary Club Of Madras Chenna Patna",
      company_name: "Config Solutions Private Limited ",
      date_of_birth: { nanoseconds: 0, seconds: 134870400 },
      designation: "Director",
      email: "rcantony@gmail.com",
      email_address: "rcantony@gmail.com",
      emergency_contact_name: "Mariaselvi",
      emergency_contact_phone: 9962882591,
      emergency_contact_relationship: "Spouse",
      meal_preference: "Non-Vegetarian",
      name: "Antony Kumar RC",
      phone: 9840960300,
      photograph:
        "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
      residential_address:
        "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
      role: "member",
      rotarian_since: 2023,
      rotary_foundation_title: "Paul Harris Fellow (PHF)",
      sex: "Male",
      shirt_size: 42,
      spouses_name: "Mariaselvi",
      support: false,
      t_shirt_size: "XL",
      type_of_business: "Professional Services",
      wedding_anniversary: "28/05",
      name: "Antony Kumar RC",
      company_sector: "IT Services",
    },
    {
      about_your_business:
        "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
      business_address: "Chennai",
      business_website: "www.configusa.com",
      club_name: "Rotary Club Of Madras Chenna Patna",
      company_name: "Config Solutions Private Limited ",
      date_of_birth: { nanoseconds: 0, seconds: 134870400 },
      designation: "Director",
      email: "rcantony@gmail.com",
      email_address: "rcantony@gmail.com",
      emergency_contact_name: "Mariaselvi",
      emergency_contact_phone: 9962882591,
      emergency_contact_relationship: "Spouse",
      meal_preference: "Non-Vegetarian",
      name: "Antony Kumar RC",
      phone: 9840960300,
      photograph:
        "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
      residential_address:
        "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
      role: "member",
      rotarian_since: 2023,
      rotary_foundation_title: "Paul Harris Fellow (PHF)",
      sex: "Male",
      shirt_size: 42,
      spouses_name: "Mariaselvi",
      support: false,
      t_shirt_size: "XL",
      type_of_business: "Professional Services",
      wedding_anniversary: "28/05",
      name: "Antony Kumar RC",
      company_sector: "IT Services",
    },
    {
      about_your_business:
        "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
      business_address: "Chennai",
      business_website: "www.configusa.com",
      club_name: "Rotary Club Of Madras Chenna Patna",
      company_name: "Config Solutions Private Limited ",
      date_of_birth: { nanoseconds: 0, seconds: 134870400 },
      designation: "Director",
      email: "rcantony@gmail.com",
      email_address: "rcantony@gmail.com",
      emergency_contact_name: "Mariaselvi",
      emergency_contact_phone: 9962882591,
      emergency_contact_relationship: "Spouse",
      meal_preference: "Non-Vegetarian",
      name: "Antony Kumar RC",
      phone: 9840960300,
      photograph:
        "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
      residential_address:
        "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
      role: "member",
      rotarian_since: 2023,
      rotary_foundation_title: "Paul Harris Fellow (PHF)",
      sex: "Male",
      shirt_size: 42,
      spouses_name: "Mariaselvi",
      support: false,
      t_shirt_size: "XL",
      type_of_business: "Professional Services",
      wedding_anniversary: "28/05",
      name: "Antony Kumar RC",
      company_sector: "IT Services",
    },
    {
      about_your_business:
        "We are an IT services and staff augmentation company headquartered in US and have branches in Hyderabad and Chennai.",
      business_address: "Chennai",
      business_website: "www.configusa.com",
      club_name: "Rotary Club Of Madras Chenna Patna",
      company_name: "Config Solutions Private Limited ",
      date_of_birth: { nanoseconds: 0, seconds: 134870400 },
      designation: "Director",
      email: "rcantony@gmail.com",
      email_address: "rcantony@gmail.com",
      emergency_contact_name: "Mariaselvi",
      emergency_contact_phone: 9962882591,
      emergency_contact_relationship: "Spouse",
      meal_preference: "Non-Vegetarian",
      name: "Antony Kumar RC",
      phone: 9840960300,
      photograph:
        "https://drive.google.com/open?id=1BEHpmFfmoMsr9Zsq-r51KgxFAx5NOJEw",
      residential_address:
        "105/57A, Secretariat Colony 2nd street, Kilpauk, Chennai 600010",
      role: "member",
      rotarian_since: 2023,
      rotary_foundation_title: "Paul Harris Fellow (PHF)",
      sex: "Male",
      shirt_size: 42,
      spouses_name: "Mariaselvi",
      support: false,
      t_shirt_size: "XL",
      type_of_business: "Professional Services",
      wedding_anniversary: "28/05",
      name: "Antony Kumar RC",
      company_sector: "IT Services",
    },
    // Add more directory items here
  ];

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

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

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
        // source={{ uri: item.photograph }}
        style={styles.profileImage}
        source={require("../../../assets/images/rotary_logo.png")}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.clubName}>{item.club_name}</Text>
      <View style={styles.separator} />
      <Text style={styles.companyName}>{item.company_name}</Text>
      <Text style={styles.businessType}>{item.type_of_business}</Text>
    </TouchableOpacity>
  );

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.seconds) return "01/01/1980";
    return new Date(dateObj.seconds * 1000).toLocaleDateString();
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
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  <Image
                    source={{ uri: selectedMember.photograph }}
                    style={styles.modalImage}
                    defaultSource={require("../../../assets/images/rotary_logo.png")}
                  />
                  <Text style={styles.modalName}>{selectedMember.name}</Text>
                  <Text style={styles.modalClubName}>
                    {selectedMember.club_name}
                  </Text>
                  <View style={styles.modalSeparator} />

                  <View style={styles.infoSection}>
                    {selectedMember.spouses_name && (
                      <InfoRow
                        icon="person"
                        text={`Spouse: ${selectedMember.spouses_name}`}
                      />
                    )}
                    <InfoRow
                      icon="time"
                      text={`Rotarian Since: ${selectedMember.rotarian_since}`}
                    />
                    <InfoRow
                      icon="business"
                      text={`Business: ${selectedMember.company_name}`}
                    />
                    <InfoRow
                      icon="briefcase"
                      text={`Type: ${selectedMember.type_of_business}`}
                    />
                    <InfoRow
                      icon="information-circle"
                      text={`About: ${selectedMember.about_your_business}`}
                    />
                    {selectedMember.business_website && (
                      <InfoRow
                        icon="globe"
                        text={`Website: ${selectedMember.business_website}`}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.addressButton}
                    onPress={() => handleMaps(selectedMember.business_address)}
                  >
                    <Text style={styles.addressButtonText}>
                      View Business Location
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.infoSection}>
                    <InfoRow
                      icon="calendar"
                      text={`Birth Date: ${formatDate(
                        selectedMember.date_of_birth
                      )}`}
                    />
                    {selectedMember.wedding_anniversary && (
                      <InfoRow
                        icon="heart"
                        text={`Anniversary: ${selectedMember.wedding_anniversary}`}
                      />
                    )}
                    <InfoRow
                      icon="call"
                      text={`Phone: ${selectedMember.phone}`}
                    />
                    <InfoRow
                      icon="mail"
                      text={`Email: ${selectedMember.email}`}
                    />
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.callButton]}
                      onPress={() => handleCall(selectedMember.phone)}
                    >
                      <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.emailButton]}
                      onPress={() => handleEmail(selectedMember.email)}
                    >
                      <Text style={styles.actionButtonText}>Email</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.emergencyButton]}
                      onPress={() =>
                        handleCall(selectedMember.emergency_contact_phone)
                      }
                    >
                      <Text style={styles.actionButtonText}>Emergency</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
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
        data={searchQuery ? filteredData : directoryData}
        renderItem={renderDirectoryItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        style={styles.grid}
        nestedScrollEnabled
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
    fontFamily: "Inter-Bold",
    textAlign: "center",
    marginBottom: 5,
  },
  modalClubName: {
    fontSize: 16,
    color: "#17458F",
    fontFamily: "Inter-Medium",
    textAlign: "center",
    marginBottom: 15,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#17458F",
    width: "100%",
    marginBottom: 15,
  },
  infoSection: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginBottom: 8,
    color: "#333",
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
    fontFamily: "Inter-Medium",
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
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Inter-Medium",
    fontSize: 13,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontFamily: "Inter-Medium",
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
    fontFamily: "Inter-Regular",
  },
  filterButton: {
    backgroundColor: "#A32638",
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontFamily: "Inter-Medium",
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
    fontFamily: "Inter-Medium",
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
    fontFamily: "Inter-Regular",
    color: "#666",
    textAlign: "left",
    marginBottom: 5,
  },
  businessType: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Inter-Regular",
    textAlign: "left",
  },
});

export default DirectoryScreen;