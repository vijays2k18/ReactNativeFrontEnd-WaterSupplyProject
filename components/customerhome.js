import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';

const CustomerHome = () => {
  const [dateTime, setDateTime] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [username,setUserName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        // const storedUserId = await AsyncStorage.getItem("userId");
        const storeUserName = await AsyncStorage.getItem("name");
        setToken(storedToken);
        // setUserId(Number(storedUserId));// Convert userId to a number
        setUserName(storeUserName);
      } catch (err) {
        console.error('Error retrieving user data:', err);
      }
    };

    fetchUserData();

    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setDateTime(formattedDateTime);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update time every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(token);
      console.log( await AsyncStorage.removeItem('token'))
      Alert.alert('Logged Out', 'You have been logged out.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('UserLogin'),
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Unable to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Row: User ID and Logout Button */}
      <View style={styles.topRow}>
        <View> 
        <Text style={styles.userIdText}>{username}</Text> </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
  {/* Display DateTime above the button */}
  <Text style={styles.dateTime}>{dateTime}</Text>

  {/* Display the Image above the button text */}
  <ImageBackground
    source={require('../assets/waterdrop1.png')} // Replace with the path to your PNG file
    style={styles.waterDropButton}
    imageStyle={{ borderRadius: 75 }} // Image style for rounded corners
  />

  <TouchableOpacity
    onPress={() =>
      Alert.alert('Request Submitted', 'Your water request has been submitted.')
    }
  >
    <Text style={styles.buttonText}>Request Water</Text>
  </TouchableOpacity>
</View>


    </View>
  );
};

export default CustomerHome;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#81d4fa', // Soft blue background for a refreshing feel
      justifyContent: 'flex-start', // Ensures content starts from top
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 40,
    },
    userIdText: {
      fontSize: 16,
      color: '#00796b', // Deep teal for text
      fontWeight: '600',
      flex: 1, // Ensures it stays on the left side
    },
    logoutButton: {
      backgroundColor: '#ff5252', // Red button for logout
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 3,
    },
    logoutText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowContainer: {
      flexDirection: 'row', // Aligns items horizontally (side by side)
      justifyContent: 'center', // Centers the items within the container
      alignItems: 'center', // Centers vertically
      marginTop: 20, // Adds some space above the image and button
    },
    waterDropButton: {
      width: 250, // Increased size for a larger button
      height: 300, // Increased size for a larger button
      justifyContent: 'center', // Center content vertically
      alignItems: 'center', // Center content horizontally
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 5,
      transform: [{ scaleY: 1.2 }], 
      marginRight: 20, // Adds some space between the image and the button
    },
    buttonText: {
      color: 'black', // Changed text color to black
      fontSize: 16,  // Adjusted font size for the smaller button
      fontWeight: 'bold', // Bold text
      textAlign: 'center', // Center text horizontally
      lineHeight: 50, // Center text vertically by aligning it to the height of the button
      width: 150,
      height: 50,
      borderRadius: 20,
      backgroundColor: 'lightblue',
      marginTop: 20,
      borderWidth: 1,
    },
    dateTime: {
      fontSize: 16,
      color: '#00796b', // Deep teal for text
      fontWeight: '600',
      marginBottom: 20, // Adjusted to give some space between the time and button
    },
  });
  
