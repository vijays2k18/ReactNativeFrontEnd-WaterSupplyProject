import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
StyleSheet,
Text,
View,
TextInput,
Button,
SafeAreaView,
FlatList,
Alert,
TouchableOpacity,
RefreshControl,
} from 'react-native';
const Customer = () => {
const [name, setName] = useState('');
const [phone_number, setPhoneNumber] = useState('');
const [address, setAddress] = useState('');
const [isFormVisible, setIsFormVisible] = useState(false);
const [customers, setCustomers] = useState([]);
const [editingCustomerId, setEditingCustomerId] = useState(null);
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  try {
    setRefreshing(true); // Show the refresh indicator
    await getAPI(); // Attempt to re-fetch data
  } catch (error) {
    console.error('Error during refresh:', error); // Log any errors
  } finally {
    setRefreshing(false); // Ensure the refresh indicator is hidden
  }
};
const getAPI = async () =>{
  const  token = await AsyncStorage.getItem("token")
  const response = await fetch('https://nodejs-api.pixelsscreen.com/api/users',{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
  const result = await response.json();
  setCustomers(result);
}

useEffect(() => {
  // Call the function immediately
  getAPI();

  // Set up the interval to call the function every 15 seconds
  const intervalId = setInterval(() => {
    console.log("calling every 15 seconds")
    getAPI();
  }, 15000); // 15000ms = 15 seconds

  // Cleanup function to clear the interval when the component unmounts
  return () => clearInterval(intervalId);
}, []); 

const handleAddCustomer = async () => {
  if (!name || !phone_number || !address) {
    Alert.alert('Validation Error', 'Please fill out all fields.');
    return;
  }

  // Validate phone number length
  if (phone_number.length > 10) {
    Alert.alert('Validation Error', 'Phone number cannot exceed 10 digits.');
    return;
  }

  // Check if phone number already exists
  const existingCustomer = customers.find(
    (customer) => customer.phone_number === phone_number
  );
  if (existingCustomer) {
    Alert.alert(
      'Validation Error',
      'A customer with the same phone number already exists.'
    );
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Alert.alert(
        'Authentication Error',
        'You are not authenticated. Please log in again.'
      );
      return;
    }

    console.log(`Token: ${token}`);
    console.log('Adding new customer:', { name, phone_number, address });

    const response = await fetch(
      'https://nodejs-api.pixelsscreen.com/api/users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          phone_number: phone_number,
          address: address,
        }),
      }
    );

    let result = {};
    try {
      result = await response.json();
    } catch (jsonError) {
      console.warn('Failed to parse response as JSON:', jsonError);
    }

    if (response.ok) {
      Alert.alert('Success', 'Customer added successfully.');
      const newCustomer = {
        id: result.id || Math.random().toString(), // Fallback if no ID is returned
        name,
        phone_number: phone_number,
        address,
      };

      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
      setName('');
      setPhoneNumber('');
      setAddress('');
      setIsFormVisible(false);
    } else {
      const errorMessage =
        result.message || 'Failed to add customer. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error:', error);
      Alert.alert(
        'Network Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    } else {
      console.error('Unexpected error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again later.'
      );
    }
  }
};



const handleDeleteCustomer = async (id) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Authentication Error', 'You are not authenticated. Please log in again.');
      return;
    }

    const apiUrl = `https://nodejs-api.pixelsscreen.com/api/users/${id}`;
    console.log(`API URL: ${apiUrl}`);
    console.log(`Deleting customer with ID: ${id}`);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse the response
    let result = {};
    try {
      result = await response.json();
    } catch (jsonError) {
      console.warn('Failed to parse response as JSON:', jsonError);
    }

    if (response.ok) {
      Alert.alert('Success', result.message || 'Customer deleted successfully.');
      getAPI(); 
    } else if (response.status === 404) {
      Alert.alert('Error', result.message || 'Customer not found.');
    } else {
      const errorMessage = result.message || 'Failed to delete customer.';
      Alert.alert('Error', errorMessage);
    }
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error or server not reachable:', error);
      Alert.alert(
        'Network Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    } else {
      console.error('Unexpected error during customer deletion:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  }
};



const handleEditCustomer = (customer) => {
  setEditingCustomerId(customer.id);
  setName(customer.name);
  setPhoneNumber(customer.phone_number);
  setAddress(customer.address);
  setIsFormVisible(true);
};

const handleUpdateCustomer = async () => {
  if (!name || !phone_number || !address) {
    Alert.alert('Error', 'Please fill out all fields.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Alert.alert(
        'Authentication Error',
        'You are not authenticated. Please log in again.'
      );
      return;
    }
    const response = await fetch(`https://nodejs-api.pixelsscreen.com/api/users/${editingCustomerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        phone_number: phone_number,
        address: address,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert('Error', errorData.message || 'Failed to update customer.');
      return;
    }

    const updatedCustomer = await response.json();

    // Update local state
    setCustomers(
      customers.map((customer) =>
        customer.id === editingCustomerId ? updatedCustomer : customer
      )
    );

    // Clear form
    setName('');
    setPhoneNumber('');
    setAddress('');
    setEditingCustomerId(null);
    setIsFormVisible(false);

    Alert.alert('Success', 'Customer updated successfully!');
  } catch (error) {
    Alert.alert('Error', 'An error occurred while updating the customer.');
    console.error(error);
  }
};


return (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Customer Management</Text>
      <Button
        title={isFormVisible ? 'Cancel' : 'Add Customer'}
        onPress={() => {
          setIsFormVisible(!isFormVisible);
          setEditingCustomerId(null);
          setName('');
          setPhoneNumber('');
          setAddress('');
        }}
        color={isFormVisible ? '#E74C3C' : '#4CAF50'}
      />
    </View>

    {isFormVisible && (
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Customer Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Customer Phone Number"
            keyboardType="phone-pad"
            value={phone_number}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Customer Address"
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />
        </View>
        <Button
          title={editingCustomerId ? 'Update' : 'Add'}
          color="#4CAF50"
          onPress={editingCustomerId ? handleUpdateCustomer : handleAddCustomer}
        />
      </View>
    )}

    {/* Customer List Heading */}
    <View style={styles.listHeading}>
      <Text style={[styles.headingText, { flex: 3 }]}>Customer List</Text>
    </View>

    <FlatList
      data={customers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.customerCard}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.customerDetails}>Phone: {item.phone_number}</Text>
            <Text style={styles.customerDetails}>Address: {item.address}</Text>
          </View>
          <View style={styles.operations}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => handleEditCustomer(item)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDeleteCustomer(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  padding: 10,
},
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
headerText: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#34495E',
},
formContainer: {
  backgroundColor: '#f4f4f8',
  padding: 10,
  borderRadius: 10,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
inputGroup: {
  marginBottom: 15,
},
label: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#34495E',
  marginBottom: 5,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  fontSize: 14,
  backgroundColor: '#fff',
},
customerCard: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
customerInfo: {
  flex: 3,
},
operations: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-around',
},
button: {
  padding: 5,
  borderRadius: 5,
},
editButton: {
  backgroundColor: '#FFC107',
},
deleteButton: {
  backgroundColor: '#E74C3C',
},
buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},
customerName: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#34495E',
},
customerDetails: {
  fontSize: 14,
  color: '#7F8C8D',
},
listHeading: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f4f4f8',
  padding: 10,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  marginBottom: 5,
},
headingText: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#34495E',
  textAlign: 'center',
},
});

export default Customer;


