import { StyleSheet, View, Image, SafeAreaView, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); // State to store the token
  const navigation = useNavigation();

  const postAPIData = async (username, password, navigation) => {
    // Check if username or password is empty
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://nodejs-api.pixelsscreen.com/admin/login', {
        method: 'POST', // Specify HTTP method
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
        // Store the token in state
        setToken(result.token);

        // Navigate to AdminHome with the token
        Alert.alert('Success', 'Login successful', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'AdminHome', params: { token: result.token, username: username } }
                ],
              });
            },
          },
        ]);
      } else {
        // If login fails (e.g., incorrect username/password)
        Alert.alert('Error', result.message || 'Invalid username or password');
      }
    } catch (error) {
      // If there is an error with the API call
      console.error('Login API Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
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
            title="Login"
            onPress={() => postAPIData(username, password, navigation)}
          />
        </View>
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
    flex: 1, // Takes up available space without affecting input fields
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 80, // Adjusted to prevent overlap
  },
  formContainer: {
    flex: 2, // Allows form to occupy space after the logo
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
    flexShrink: 0, // Prevents collapsing when text is entered
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    borderRadius: 30,
  },
});
