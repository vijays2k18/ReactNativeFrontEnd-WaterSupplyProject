import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const [error, setError] = useState(null); // State to store error messages
  const [userIds, setUserIds] = useState([]);

 

  useEffect(() => {
    const fetchStatuses = async () => {
      console.log('Fetching statuses...');
      const token = await AsyncStorage.getItem('token'); // Fetch token from AsyncStorage
      console.log(token, 'Token from AsyncStorage');
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
            console.log(data, "------------data from getuserstatus---------------");
          
            // Extract all user_id values into an array
            const userIds = data.map((item) => item.user_id);
            console.log(userIds, "Extracted user IDs");
            setUserIds(userIds);
            console.log(userIds,"----------data comming from array-----------------")
            setError(null);
          
            // If needed, store the userIds in a state or use them directly
            // setUserIds(userIds); // Uncomment if you have a state for user IDs
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

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array, so it runs only once

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Dashboard</Text>
      
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statusItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
});
