import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { collection, getDocs, addDoc, Timestamp, doc, updateDoc, deleteDoc, query, orderBy, limit, startAfter } from "firebase/firestore";

import { db } from "@/firebaseConfig";

export default function Itinerary() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);

  const PAGE_SIZE = 10;

  const fetchItineraries = async (startDoc = null, reset = false) => {
    setLoading(true);

    if (reset) {
      setItineraries([]);
      setLastVisibleDoc(null);
    }

    try {
      const itineraryRef = collection(db, 'itineraries');
      let q = query(itineraryRef, orderBy('startTime', 'desc'), limit(PAGE_SIZE));

      if (startDoc) {
        q = query(itineraryRef, orderBy('startTime', 'desc'), startAfter(startDoc), limit(PAGE_SIZE));
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length < PAGE_SIZE) {
        setLastVisibleDoc(null); // No more documents to fetch
      }

      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        // Update last visible document or null if no more documents
        setLastVisibleDoc(querySnapshot.docs.length < PAGE_SIZE ? null : lastDoc);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItineraries((prevItineraries) => {
          const newIds = new Set(prevItineraries.map((item) => item.id));
          const filteredData = data.filter((item) => !newIds.has(item.id));
          return [...prevItineraries, ...filteredData];
        });
      } else {
        setLastVisibleDoc(null); // No more documents to fetch
      }
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!lastVisibleDoc) {
      console.log('No more data')
      return;
    }
    fetchItineraries(lastVisibleDoc);
  };

  const addRandomItinerary = async () => {
    setLoading(true);

    const randomItinerary = {
      title: `Trip to ${["Paris", "London", "New York", "Tokyo"][Math.floor(Math.random() * 4)]}`,
      type: ["Leisure", "Business", "Adventure"][Math.floor(Math.random() * 3)],
      location: `Location-${Math.floor(Math.random() * 100)}`,
      startTime: Timestamp.fromDate(new Date()),
      endTime: Timestamp.fromDate(new Date(Date.now() + 86400000)), // 1 day later
      description: "This is a randomly generated itinerary.",
    };

    try {
      await addDoc(collection(db, "itineraries"), randomItinerary);
      console.log("Random itinerary added!");
      fetchItineraries(null, true); // Refresh after adding
    } catch (error) {
      console.error("Error adding itinerary:", error);
    }

    setLoading(false);
  };

  const updateItinerary = async (id) => {
    setLoading(true);

    const randomDescription = `Updated description: ${Math.random().toFixed(3)}`;
    try {
      const itineraryDoc = doc(db, "itineraries", id);
      await updateDoc(itineraryDoc, { description: randomDescription });
      fetchItineraries(null, true)
    } catch (error) {
      console.error("Error updating itinerary:", error);
    }

    setLoading(false);
  };

  const deleteItinerary = async (id) => {
    setLoading(true);

    try {
      const itineraryDoc = doc(db, "itineraries", id);
      await deleteDoc(itineraryDoc);
      fetchItineraries(null, true)
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchItineraries();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Itinerary</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (itineraries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Itinerary</Text>
        <View style={styles.buttonContainer}>
          <Button title="Refresh" onPress={() => fetchItineraries(null, true)} />
          <Button title="Add Itinerary" onPress={addRandomItinerary} />
        </View>
        <Text>No itineraries found.</Text>
      </View>
    );  
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.heading}>Itinerary</Text>
      <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={() => fetchItineraries(null, true)} />
        <Button title="Add Itinerary" onPress={addRandomItinerary} />
      </View>

      <FlatList
        data={itineraries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Location: {item.location}</Text>
            <Text>
              Start: {new Date(item.startTime.seconds * 1000).toLocaleString()}
            </Text>
            <Text>
              End: {new Date(item.endTime.seconds * 1000).toLocaleString()}
            </Text>
            <Text>Description: {item.description}</Text>
            <View style={[styles.buttonContainer, { marginTop: 20 }]}>
              <Button
                title="Update"
                onPress={() => updateItinerary(item.id)}
                color="blue"
              />
              <Button
                title="Delete"
                onPress={() => deleteItinerary(item.id)}
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
