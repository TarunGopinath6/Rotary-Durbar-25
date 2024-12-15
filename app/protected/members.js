import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { collection, getDocs, setDoc, getDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where } from "firebase/firestore";

import { db, auth } from "@/firebaseConfig";


export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);

  const PAGE_SIZE = 10;

  const fetchMembers = async (startDoc = null, reset = false) => {
    setLoading(true);

    if (reset) {
      setMembers([]);
      setLastVisibleDoc(null);
    }

    try {
      const memberRef = collection(db, 'users');
      let q = query(
        memberRef,
        where('role', 'not-in', ['admin', ]),
        where('support', '==', false),
        orderBy('name', 'asc'),
        limit(PAGE_SIZE)
      );

      if (startDoc) {
        q = query(
          memberRef,
          where('role', 'not-in', ['admin', ]),
          where('support', '==', false),
          orderBy('name', 'asc'),
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
        setLastVisibleDoc(querySnapshot.docs.length < PAGE_SIZE ? null : lastDoc);

        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data(); // Get the full document data

          // Return only the required fields along with the document ID
          return {
            id: doc.id,
            name: docData.name,
            affiliation: docData.affiliation,
            company_name: docData.company_name,
            company_sector: docData.company_sector,
          };
        });

        setMembers((prevMembers) => {
          const newIds = new Set(prevMembers.map((item) => item.id));
          const filteredData = data.filter((item) => !newIds.has(item.id));
          return [...prevMembers, ...filteredData];
        });
      } else {
        setLastVisibleDoc(null); // No more documents to fetch
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!lastVisibleDoc) {
      console.log('No more data')
      return;
    }
    fetchMembers(lastVisibleDoc);
  };

  const addRandomMembers = async () => {
    setLoading(true);

    const randomName = `User_${Math.floor(Math.random() * 1000)}`;
    const randomAffiliation = `Affiliation_${Math.floor(Math.random() * 100)}`;
    const randomSpouse = `Spouse_${Math.floor(Math.random() * 100)}`;
    const randomPhone = `+1-${Math.floor(Math.random() * 1000000000)}`;
    const randomEmail = `${randomName}@app.com`;
    const randomAddress = `Address ${Math.floor(Math.random() * 1000)}`;
    const randomCompanyName = `Company_${Math.floor(Math.random() * 100)}`;
    const randomCompanySector = `Sector_${Math.floor(Math.random() * 10)}`;
    const randomCompanyDescription = `Description of ${randomCompanyName}`;
    const randomCompanyEmail = `${randomCompanyName}@company.com`;
    const randomCompanyAddress = `Company Address ${Math.floor(Math.random() * 100)}`;
    const randomMemberSince = new Date().toISOString();
    const randomDateOfBirth = new Date(1980 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, randomEmail, randomName);
      const user = userCredential.user;

      // Now, add the user details to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: randomName,
        role: 'member', // Assuming 'member' as a role for simplicity
        support: false,
        affiliation: randomAffiliation,
        spouse: randomSpouse,
        member_since: randomMemberSince,
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

      console.log('Random member added:', randomName);
      fetchMembers(null, true)
    } catch (error) {
      console.error('Error adding random member:', error);
    }
    setLoading(false);

  };

  const updateMembers = async (id) => {
    setLoading(true);

    const randomCompany = `Comapny_${Math.random().toFixed(3)}`;
    try {
      const memberDoc = doc(db, "users", id);
      await updateDoc(memberDoc, { company_name: randomCompany });
      fetchMembers(null, true)
    } catch (error) {
      console.error("Error updating member:", error);
    }

    setLoading(false);
  };

  const deleteMembers = async (id) => {
    setLoading(true);

    try {
      const memberDoc = doc(db, "users", id);
      await deleteDoc(memberDoc);
      
      fetchMembers(null, true)
    } catch (error) {
      console.error("Error deleting member:", error);
    }

    setLoading(false);
  };

  const showMoreInfo = async (id) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        alert('Check console')
        console.log(userDoc.data())
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }

    setLoading(false);

  }

  useEffect(() => {
    fetchMembers();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Members</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Members</Text>
        <View style={styles.buttonContainer}>
          <Button title="Refresh" onPress={() => fetchMembers(null, true)} />
          <Button title="Add Members" onPress={addRandomMembers} />
        </View>
        <Text>No members found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Members</Text>
      <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={() => fetchMembers(null, true)} />
        <Button title="Add Members" onPress={addRandomMembers} />
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.title}>{item.title}</Text>
            <Text>Name: {item.name}</Text>
            <Text>affiliation: {item.affiliation}</Text>
            <Text>Comapny Name: {item.company_name}</Text>
            <Text>Comapny Sector: {item.company_sector}</Text>

            <View style={[styles.buttonContainer, { marginTop: 20 }]}>
              <Button
                title="Update"
                onPress={() => updateMembers(item.id)}
                color="blue"
              />
              <Button
                title="Show More Info"
                onPress={() => showMoreInfo(item.id)}
                color="green"
              />
              <Button
                title="Delete"
                onPress={() => deleteMembers(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {lastVisibleDoc && <Button onPress={loadMoreData} title="Load More" />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    flex: 1,
    padding: 16
  },
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heading: {
    fontSize: 24, // Adjust size for different levels of headings
    fontWeight: 'bold', // Make it bold to distinguish as a heading
    color: '#333', // Choose your desired color
    textAlign: 'center', // Optional: Center align text
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
