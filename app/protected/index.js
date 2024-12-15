import { View, Button, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';


export default function SandboxScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonStyle}>
        <Button title="Itinerary" onPress={() => router.push('/protected/itinerary')} />
        <Text style={styles.textStyle}>CRUD + Infinite Scrolling Pagination (10 records at a time) + Sort by startTime DESC</Text>
      </View>
      <View style={styles.buttonStyle}>
        <Button title="Members" onPress={() => router.push('/protected/members')} />
        <Text style={styles.textStyle}>CRUD + Infinite Scrolling Pagination (10 records at a time) + Sort by name ASC + Dynamic load (click to display more) + Filtered for non-admins and non-support users.</Text>
      </View>
      <View style={styles.buttonStyle}>
        <Button title="Profile" onPress={() => router.push('/protected/profile')} />
        <Text style={styles.textStyle}>Show all key-value data of current user</Text>
      </View>
      <View style={styles.buttonStyle}>
        <Button title="Support Users" onPress={() => router.push('/protected/support')} />
        <Text style={styles.textStyle}>CRUD + Infinite Scrolling Pagination (10 records at a time) + Sort by name ASC + Dynamic load (click to display more) + Filtered for non-admins and support users.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonStyle: {
    margin: 20,
    width: '90%',
  },
  textStyle: {
    width: '100%', // Make text occupy the same width as the button
    textAlign: 'center', // Center align the text
    marginTop: 10,
  },

});