import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

// Define your Dashboard and Customer components
const Dashboard = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Dashboard</Text>
  </View>
);

const Customer = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Customer</Text>
  </View>
);

const AdminHome = ({ route }) => {
  const [token, setToken] = useState('');
  const navigation = useNavigation(); // Use navigation for logout button
  const data = route.params;

  // UseEffect to set the token
  useEffect(() => {
    if (route.params?.token) {
      setToken(route.params.token); // Safely set the token
    }
  }, [route.params]);

  console.log(token);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome {data?.username || 'Admin'}</Text>
        <Button
          title="Logout"
          color="#E74C3C" // Red color for logout button
          onPress={() => {
            setToken(''); // Clear the token
            navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] }); // Navigate to AdminLogin
          }}
        />
      </View>

      {/* Bottom Navigation */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Hide the header for tab screens
          tabBarActiveTintColor: '#1E90FF', // Active tab color
          tabBarInactiveTintColor: 'gray', // Inactive tab color
          tabBarStyle: {
            backgroundColor: '#2C3E50', // Dark background color for bottom tab
            borderTopWidth: 0, // Remove the top border
            paddingBottom: 10, // Add some padding at the bottom for a more spaced-out look
            height: 60, // Adjust height for a more professional look
          },
        }}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Customer" component={Customer} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1', // Light gray background for the app
    justifyContent: 'flex-start',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align logout button and welcome text
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff', // White background for header
    borderRadius: 10, // Rounded corners for header
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495E', // Dark color for the welcome text
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for the screen sections
    borderRadius: 10, // Rounded corners for a clean look
    margin: 10,
  },
  screenText: {
    fontSize: 18,
    color: '#34495E', // Matching the header color
  },
});
