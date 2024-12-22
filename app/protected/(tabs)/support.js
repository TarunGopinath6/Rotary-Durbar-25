import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, setDoc, getDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter, where, writeBatch } from "firebase/firestore";

import { db, auth } from "@/firebaseConfig";


export default function Support() {
  const [support, setSupport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);

  const PAGE_SIZE = 10;

  const fetchSupport = async (startDoc = null, reset = false) => {
    setLoading(true);

    if (reset) {
      setSupport([]);
      setLastVisibleDoc(null);
    }

    try {
      const supportRef = collection(db, 'users');
      let q = query(
        supportRef,
        where('role', 'not-in', ['admin',]),
        where('support', '==', true),
        orderBy('name', 'asc'),
        limit(PAGE_SIZE)
      );

      if (startDoc) {
        q = query(
          supportRef,
          where('role', 'not-in', ['admin',]),
          where('support', '==', true),
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
            designation: docData.designation,
            email: docData.email,
            phone: docData.phone,
            affiliation: docData.affiliation,
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
      console.log('No more data')
      return;
    }
    fetchSupport(lastVisibleDoc);
  };

  const addRandomSupport = async () => {
    setLoading(true);

    const randomName = `User_${Math.floor(Math.random() * 1000)}`;
    const randomAffiliation = `Affiliation_${Math.floor(Math.random() * 100)}`;
    const randomDesignation = `Committee/Doctor of ${Math.floor(Math.random() * 100)}`
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
        role: 'member',
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

      console.log('Random support added:', randomName);
      fetchSupport(null, true)
    } catch (error) {
      console.error('Error adding random support:', error);
    }
    setLoading(false);

  };

  const updateSupport = async (id) => {
    setLoading(true);

    const randomDesignation = `Committee/Doctor of ${Math.floor(Math.random() * 100)}`
    try {
      const supportDoc = doc(db, "users", id);
      await updateDoc(supportDoc, { designation: randomDesignation });
      fetchSupport(null, true)
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

      fetchSupport(null, true)
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

  const batchDeleteCollection = async () => {
    const collectionPath = "users"
    const batchSize = 500;

    setLoading(true);

    const collectionRef = collection(db, collectionPath);
    const q = query(
      collectionRef,
      where('role', 'not-in', ['admin',]),
      where('support', '==', true),
      orderBy('name', 'asc'),
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

      console.log(`Successfully deleted ${totalDeleted} documents from ${collectionPath}`);

    } catch (error) {
      console.error('Error deleting collection:', error);
    }

    setLoading(false);
    fetchSupport(null, true);
  }

  async function executeDelete(documentRefs) {
    const batch = writeBatch(db);

    documentRefs.forEach(docRef => {
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
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Support</Text>
      <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={() => fetchSupport(null, true)} />
        <Button title="Add Support" onPress={addRandomSupport} />
        <Button
          title="Delete All"
          onPress={batchDeleteCollection}
          color="red"
        />
      </View>

      <FlatList
        data={support}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.title}>{item.title}</Text>
            <Text>Name: {item.name}</Text>
            <Text>affiliation: {item.affiliation}</Text>
            <Text>designation: {item.designation}</Text>

            <View style={[styles.buttonContainer, { marginTop: 20 }]}>
              <Button
                title="Update"
                onPress={() => updateSupport(item.id)}
                color="blue"
              />
              <Button
                title="Show More Info"
                onPress={() => showMoreInfo(item.id)}
                color="green"
              />
              <Button
                title="Delete"
                onPress={() => deleteSupport(item.id)}
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
