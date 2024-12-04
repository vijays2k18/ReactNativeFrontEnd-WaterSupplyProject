import { StyleSheet, Text, View, Image, SafeAreaView, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';

const UserLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    // Validate phone number (ensure it has between 10 and 15 digits)
    if (phoneNumber.length < 10) {
      Alert.alert("Invalid Phone Number", "Phone number must be at least 10 digits.");
    } else if (phoneNumber.length > 10) {
      Alert.alert("Invalid Phone Number", "Phone number cannot be more than 10 digits.");
    } else {
      // Proceed with login logic here
      Alert.alert("Login Successful", `Welcome, ${phoneNumber}`);
    }
  };

  const handlePhoneNumberChange = (text) => {
    if (text.length > 10) {
      Alert.alert("Invalid Phone Number", "Phone number cannot be more than 15 digits.");
      setPhoneNumber('');  // Clear the phone number input
    } else {
      setPhoneNumber(text);
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
          keyboardType="phone-pad"  // Ensures numeric input
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}  // Use the updated handler
          maxLength={15}  // Restrict user input to 15 characters
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
