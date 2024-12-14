import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const [error, setError] = useState(null); // State to store error messages
  const [userIds, setUserIds] = useState([]);
  const [users, setUsers] = useState([]);  // Store user details
  const [requsted,setRequested] = useState([])



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
          
            // Extract all user_id values into an array
            const userIds = data.map((item) => item.user_id);
            const requested1 = data.map((item) => item.requested);
            setRequested(requested1);
            setUserIds(userIds);
            console.log(data,"------Receiving Data-------------------")

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


  useEffect(() => {
    // Function to fetch user details by ID
    const fetchUserDetails = async () => {
        console.log(requsted,"------************ Data-------------------")

        console.log(userIds,"useridcomming")
        const token = await AsyncStorage.getItem('token'); // Fetch token from AsyncStorage
        console.log(token,"bearertoken----------")
      try {
        const userPromises = userIds.map(id =>
            fetch(`https://nodejs-api.pixelsscreen.com/api/users/${id}`, {
              method: 'GET',  // Default method is GET, but you can specify it for clarity
              headers: {
                Authorization: `Bearer ${token}`,  // Adding the Bearer token to the headers
                'Content-Type': 'application/json',
              },
            })
              .then((response) => response.json())
          );

        const userResponses = await Promise.all(userPromises);
        setUsers(userResponses); // Save all user details
        console.log(users,"users-------------------------")

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userIds]); 


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.userName}>Name: {item.name}</Text>
      <Text style={styles.userPhone}>Phone: {item.phone_number}</Text>
      <Text style={styles.userAddress}>Address: {item.address}</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Dashboard</Text>
      <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}  // Assuming 'id' is a unique key
    />    
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
  flatListContainer: {
    padding: 10,
    // Add padding around the FlatList
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    gap:10
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  userPhone: {
    marginVertical: 5,
    fontSize: 16,
  },
  userAddress: {
    fontSize: 16,
  },
});
