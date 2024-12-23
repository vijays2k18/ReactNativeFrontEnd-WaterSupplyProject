import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';

const CustomerHome = () => {
  const [dateTime, setDateTime] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [username,setUserName] = useState('');
  const [request,setRequest] = useState('')
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId");
        const storeUserName = await AsyncStorage.getItem("name");
        setToken(storedToken);
        setUserId(storedUserId); // Convert userId to a number
        setUserName(storeUserName);
      } catch (err) {
        console.error('Error retrieving user data:', err);
      }
    };
  
    fetchUserData(); // Call the function here, outside of itself
  
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setDateTime(formattedDateTime);
    };
  
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update time every second
  
    return () => clearInterval(interval); // Clean up on unmount
  }, []);
  
  const requestwater = async () => {
    console.log('button works'); // Ensure this is printed when button is clicked
    console.log('Token:', token);
    console.log('User ID:', userId);
  
    if (!userId.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid User ID');
      return;
    }
 
    try {
      const response = await fetch('https://nodejs-api.pixelsscreen.com/user/requested', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
  
      console.log('API response:', response); // Log the response object
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      }
  
      const data = await response.json();
      console.log(data,"dataaaaaaaaaaaa")
      Alert.alert('Success', data.message);
      console.log(userId,'-------Navigation to Dashboard Page---------')
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.message);
    }
  };
 
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

  useEffect(() => {
    const fetchUserStatuses = async () => {
      const storedToken1 = await AsyncStorage.getItem("token"); 
      try {
        const response = await fetch('https://nodejs-api.pixelsscreen.com/users/status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken1}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user statuses');
        }
  
        const responseData = await response.json();

const storedUserId = await AsyncStorage.getItem("userId");
const userId1 = Number(storedUserId); // Ensure this is dynamic if needed
// Map response data to only include the user with the matching userId
const matchedUsers = responseData.filter((item) => Number(item.user_id) === userId1); 
// Check if there is any matched user
if (matchedUsers.length > 0) {
  const user = matchedUsers[0]; // Assume the first match (if unique user IDs)
  setRequest(user.requested);
  console.log(user.requested, "user requested number");
} else {
  setRequest(null); // No match found
  console.log("No matching user found");
}

      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };
  
    fetchUserStatuses();
    const intervalId = setInterval(fetchUserStatuses, 2000);
  
    return () => clearInterval(intervalId);
  }, []);
  
  // Admin Token Fetch for Notification FCM Token
  
  const fetchAdminToken = async () => {
    const id = await AsyncStorage.getItem("admin_id");
    const userId = Number(id);
    const token = await AsyncStorage.getItem("token"); // Retrieve Bearer token
    
    if (!userId) {
      Alert.alert('Error', 'User ID is required');
      return;
    }
  
    try {
      const response = await fetch(`https://nodejs-api.pixelsscreen.com/get-admin-token/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add Bearer token here
        },
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        await AsyncStorage.setItem("admin_token",responseData.admin_token);
        console.log(responseData.admin_token,"// ************ Admin Token *********************")
      } else {
        Alert.alert('Error', responseData.error || 'Failed to retrieve admin token');
      }
    } catch (error) {
      console.error('Error fetching admin token:', error);
      Alert.alert('Error', 'An error occurred while fetching the admin token');
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

<View style={styles.container}>
      {request === 1 && (
        <Text style={styles.message}>Your request has been submitted successfully.</Text>
      )}
      {request === 2 && (
        <Text style={styles.message}>Your request has been approved!</Text>
      )}
      {(request !== 1 && request !== 2) && (
        <View style={styles.buttonWrapper}>
          <Button
            title="Request Water"
            onPress={requestwater}
            color="black"
          />
        </View>
      )}
    </View>
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
    buttonWrapper: {
      width: 200, // Increased width for the button
      height: 60, // Increased height for the button
      borderRadius: 30, // Adjusted border radius for a larger button
      backgroundColor: 'lightblue', // Button background color
      justifyContent: 'center', // Center text vertically
      alignItems: 'center', // Center text horizontally
      position: 'absolute', // Position the button at the bottom
      bottom: 180, // Distance from the bottom of the screen
      alignSelf: 'center', // Center the button horizontally
      borderWidth: 1,
      borderColor: 'black', // Border color to match style
    },
    
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 16,
    },
  });
  
