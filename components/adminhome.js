import { StyleSheet, Text, View, SafeAreaView, Button,TextInput, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons or another icon set
import Customer from './customer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dashboard from './admindashboard';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';



const Tab = createBottomTabNavigator();

const AdminHome = ({ route }) => {
 
  // *********************************************************************************************** //
  const navigation = useNavigation(); // Use navigation for logout button
  const data = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome {data?.username || 'Admin'}</Text>
        <Button
          title="Logout"
          color="#E74C3C"
          onPress={async () => {
            await AsyncStorage.removeItem("token");
            navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
          }}
        />
      </View>

      {/* Bottom Navigation */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            paddingBottom: 10,
            height: 60,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = 'dashboard'; // Icon for Dashboard
            } else if (route.name === 'Customer') {
              iconName = 'people'; // Icon for Customer
            }

            return <Icon name={iconName} size={size || 24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Customer" component={Customer}/>
      </Tab.Navigator>
    </SafeAreaView>
  );
};



export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495E',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },
  screenText: {
    fontSize: 18,
    color: '#34495E',
  },
  customerarea: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f4f4f8', // Light background for the form area
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textarea: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

