import { StyleSheet, View, Image, SafeAreaView, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for login button

  const navigation = useNavigation();

  const postAPIData = async (username, password, navigation) => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await fetch('http://nodejs-api.pixelsscreen.com/admin/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem("token", result.token);

        // Navigate to AdminHome with the token
        Alert.alert('Success', 'Login successful', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'AdminHome', params: { username: username } }
                ],
              });
            },
          },
        ]);
      } else {
        // If login fails, show the error message from the API
        Alert.alert('Error', result.error || 'Invalid username or password');
      }
    } catch (error) {
      // Catch any errors that occur during the fetch
      console.error('Login API Error:', error);
      if (error.name === 'TypeError') {
        // Handle network errors
        Alert.alert('Network Error', 'Please check your internet connection.');
      } else {
        // Handle other errors
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false); // Hide loading indicator after the request completes
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
          placeholder="Enter Your Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Your Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Logging In...' : 'Login'}
            onPress={() => postAPIData(username, password, navigation)}
            disabled={loading} // Disable button while loading
          />
        </View>

        {/* Show loading indicator while the API request is in progress */}
        {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}
      </View>
    </SafeAreaView>
  );
};

export default AdminLogin;

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
    marginTop: 80,
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
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
    borderRadius: 30,
  },
  loader: {
    marginTop: 20,
  },
});
