import { Platform ,StyleSheet, Text, View, FlatList, TouchableOpacity,Alert,PermissionsAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';


const Dashboard = () => {
  const [error, setError] = useState(null); // State to store error messages
  const [userIds, setUserIds] = useState([]);
  const [users, setUsers] = useState([]); // Store user details
  const [requested, setRequested] = useState([]); // Fix typo
  const [combinedData, setCombinedData] = useState([]);
  // ---------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const getToken = async () => {
      try {
        // Request user permission for notifications
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
        if (enabled) {
          // Get FCM token
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
          await AsyncStorage.setItem("fcmToken", token);
        } else {
          Alert.alert('Permission denied', 'Enable notifications to get FCM token.');
        }
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };
  
    getToken();
  
    // Optional: Handle token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
      console.log('FCM Token refreshed:', token);
      setFcmToken(token);
    });
  
    // Handle foreground notifications
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      Alert.alert('Notification', remoteMessage.notification?.title || 'New Notification');
    });
  
    // Handle background notifications
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background notification received:', remoteMessage);
    });
  
    // Cleanup function: only unsubscribe from onTokenRefresh and onMessage
    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
    };
  }, []);
  


  const saveAdminToken = async () => {
    try {
      const id = await AsyncStorage.getItem("adminId"); // Await to get the value
      const fcmToken = await AsyncStorage.getItem("fcmToken");
      const userId = Number(id);
      console.log("Admin ID:", id,userId);
      console.log("FCM Token ***************:", fcmToken);
    
      const response = await fetch('https://nodejs-api.pixelsscreen.com/admintoken/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          admin_token: fcmToken,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message || 'Failed to save admin token.');
      }
    } catch (error) {
      console.error('Error saving admin token:', error);
      Alert.alert('Error', 'Failed to save admin token.');
    }
  };
  
 
  // Fetch user statuses periodically
  useEffect(() => {
    const fetchStatuses = async () => {
      const token = await AsyncStorage.getItem('token'); // Fetch token from AsyncStorage
      try {
        const response = await fetch('https://nodejs-api.pixelsscreen.com/users/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Pass Bearer token
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setUserIds(data.map((item) => item.user_id));
          setRequested(data.map((item) => ({ id: item.user_id, requested: item.requested })));
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error fetching user statuses');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      }
    };
  
    // Call the function every 2 seconds
    const intervalId = setInterval(() => {
      fetchStatuses();
    }, 2000);
      // Consolidate cleanup logic into a single return statement
    return () => {
      clearInterval(intervalId); // Cleanup the interval
       };
  }, []);
  
  // Fetch user details when userIds change
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem('token'); // Fetch token from AsyncStorage
      try {
        const userPromises = userIds.map((id) =>
          fetch(`https://nodejs-api.pixelsscreen.com/api/users/${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).then((response) => response.json())
        );

        const userResponses = await Promise.all(userPromises);
        setUsers(userResponses); // Save all user details
      } catch (error) {
        setError('Error fetching user details');
        console.error('Error fetching user details:', error);
      }
    };

    if (userIds.length > 0) {
      fetchUserDetails();
    }
  }, [userIds]);

  // Combine `users` and `requested` arrays
  useEffect(() => {
    const combined = users.map((user) => ({
      ...user,
      requested: requested.find((req) => req.id === user.id)?.requested || null, // Match by ID
    }));

    setCombinedData(combined);
  }, [users, requested]);

  // Save Admin Token

  useEffect(()=>{
    saveAdminToken();
  },[])
  // Handle button actions
  const handleApproval = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');// Fetch token from AsyncStorage
      // Make a POST request to the API endpoint
      const response = await fetch('https://nodejs-api.pixelsscreen.com/user/approved', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id, // Send the user ID in the request body
        }),
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        // Success response
        console.log('User status set to Approved:', data.message);
        alert('User status successfully set to Approved.');
      } else {
        // Handle API errors
        console.error('Error setting user status to Approved:', data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error making the API request:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const handleDelivery = async (id) => {
    console.log(`Delivery button clicked for item ID: ${id}`);
    try {
      const token = await AsyncStorage.getItem('token');// Fetch token from AsyncStorage
      // Make a POST request to the API endpoint
      const response = await fetch('https://nodejs-api.pixelsscreen.com/user/delivery', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id, // Send the user ID in the request body
        }),
      });
  
      // Parse the response
      const data = await response.json();
  
      if (response.ok) {
        // Success response
        console.log('User status set to Approved:', data.message);
        alert('User status successfully set to Approved.');
      } else {
        // Handle API errors
        console.error('Error setting user status to Approved:', data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error making the API request:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Render each user item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Only show details if requested is not 3 */}
      {item.requested !== 3 && (
        <>
          <Text style={styles.userName}>Name: {item.name}</Text>
          <Text style={styles.userPhone}>Phone: {item.phone_number}</Text>
          <Text style={styles.userAddress}>Address: {item.address}</Text>
        </>
      )}
  
      {/* Conditional buttons */}
      <View style={styles.buttonContainer}>
        {item.requested === 1 && (
          <TouchableOpacity
            style={styles.approvedButton}
            onPress={() => handleApproval(item.id)}
          >
            <Text style={styles.buttonText}>Approved</Text>
          </TouchableOpacity>
        )}
        {item.requested === 2 && (
          <TouchableOpacity
            style={styles.deliveryButton}
            onPress={() => handleDelivery(item.id)}
          >
            <Text style={styles.buttonText}>Delivery</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Customer Request </Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={combinedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Assuming 'id' is a unique key
      />
    </View>
  );
};

export default Dashboard;

// Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  screenText: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 4,
  },
  userAddress: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  approvedButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
  },
  deliveryButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
