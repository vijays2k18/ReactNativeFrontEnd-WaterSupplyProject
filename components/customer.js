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
} from 'react-native';
const Customer = ({route}) => {
const [token, setToken] = useState('');
const [name, setName] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [address, setAddress] = useState('');
const [isFormVisible, setIsFormVisible] = useState(false);
const [customers, setCustomers] = useState([]);
const [editingCustomerId, setEditingCustomerId] = useState(null);

const getAPI = async () =>{
  const  token = await AsyncStorage.getItem("token")
  const response = await fetch('http://nodejs-api.pixelsscreen.com/api/users',{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
  const result = await response.json();
  setCustomers(result);
}

useEffect(()=>{
  getAPI(); 
},[])

const handleAddCustomer = async () => {
  if (!name || !phoneNumber || !address) {
    Alert.alert('Error', 'Please fill out all fields.');
    return;
  }

  try {
    const  token = await AsyncStorage.getItem("token")
    console.log(token)
    const response = await fetch('http://nodejs-api.pixelsscreen.com/api/users', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        phone_number: phoneNumber,
        address: address,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // If the request is successful
      Alert.alert('Success', 'Customer added successfully');
      const newCustomer = {
        id: result.id, // Assuming API returns the customer with an ID
        name,
        phoneNumber,
        address,
      };
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
      setName('');
      setPhoneNumber('');
      setAddress('');
      setIsFormVisible(false);
    } else {
      // If the request failed
      Alert.alert('Error', result.message || 'Failed to add customer.');
    }
  } catch (error) {
    // If there was an error making the request
    console.error('Error adding customer:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};

const handleDeleteCustomer = (id) => {
  setCustomers(customers.filter((customer) => customer.id !== id));
};

const handleEditCustomer = (customer) => {
  setEditingCustomerId(customer.id);
  setName(customer.name);
  setPhoneNumber(customer.phoneNumber);
  setAddress(customer.address);
  setIsFormVisible(true);
};

const handleUpdateCustomer = () => {
  if (!name || !phoneNumber || !address) {
    Alert.alert('Error', 'Please fill out all fields.');
    return;
  }

  setCustomers(
    customers.map((customer) =>
      customer.id === editingCustomerId
        ? { ...customer, name, phoneNumber, address }
        : customer
    )
  );
  setName('');
  setPhoneNumber('');
  setAddress('');
  setEditingCustomerId(null);
  setIsFormVisible(false);
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
            value={phoneNumber}
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


