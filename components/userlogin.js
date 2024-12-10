import { StyleSheet, Text, View, Image, SafeAreaView, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserLogin = () => {
  const [phone_number, setPhoneNumber] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log('Login button clicked');
  
    // Validate phone number presence
    if (!phone_number) {
      Alert.alert('Validation Error', 'Phone number is required.');
      return;
    }
  
    // Validate phone number length
    if (phone_number.length !== 10) {
      Alert.alert('Validation Error', 'Phone number must be exactly 10 digits long.');
      return;
    }
  
    try {
      const response = await fetch('https://nodejs-api.pixelsscreen.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number }),
      });
  
      // Parse response
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful', data);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", data.userId.toString());
        console.log(data.userId)
     
        // Navigate to customerhome with userId as a parameter
        Alert.alert('Success', 'Login successful.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerHome')
          },
        ]);
      } else {
        // Server-side validation failure (e.g., phone number not found)
        if (data.message) {
          Alert.alert('Login Failed', data.message);
        } else {
          Alert.alert('Login Failed', 'Something went wrong. Please try again later.');
        }
      }
    } catch (err) {
      // Network or unexpected error
      console.error('Error during login:', err.message);
      Alert.alert('Error', 'An unexpected error occurred. Please check your connection and try again.');
    }
  };
  

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
      <TextInput
  style={styles.input}
  placeholder="Enter Your Phone Number"
  keyboardType="phone-pad" // Ensures numeric input
  value={phone_number}
  onChangeText={(number) => setPhoneNumber(number)} // Correctly updates the state
  maxLength={15} // Restrict user input to 15 characters
/>

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5ee', // Light pinkish background
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 100,
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    borderRadius: 10,
  },
});
