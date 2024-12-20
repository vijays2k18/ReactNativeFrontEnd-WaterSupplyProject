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

  useEffect(()=>{
    listenToNotifications()
  },[])
  
  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage.notification);
      // Handle the notification, e.g., show a local alert or display a notification in-app
    });
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background state:', remoteMessage.notification);
      // Handle notification when app opens from background
    });
  
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from a notification:', remoteMessage.notification);
        // Handle the notification
      }
    });
  }, []);

 
  const listenToNotifications = () => {
    // Handle foreground notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new foreground notification received:', remoteMessage);
      // Optionally handle the notification here (e.g., show an alert)
    });

    return unsubscribe; // Cleanup the listener on unmount
  };
    
  const storeFcmToken = async (adminToken) => {
    try {
      // Replace with the actual user ID
      const adminId = await AsyncStorage.getItem("adminId")
      const user_id = Number(adminId)
      console.log("ghhji")
      // Make the API call
      const response = await fetch('https://nodejs-api.pixelsscreen.com/admintoken/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          admin_token: adminToken, // Pass the stored FCM token
        }),
      });
  
      // Parse the response
      console.log(response,"response")
      const responseJson = await response.json();
      console.log('Server Response:', responseJson);
  
      if (response.ok) {
        console.log('Admin token saved successfully:', responseJson);
      } else {
        console.error('Error saving admin token:', responseJson.message || 'Unknown error');
        Alert.alert('Error', responseJson.message || 'Failed to save admin token');
      }
    } catch (error) {
      console.error('Error storing FCM token:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving the admin token');
    }
  };

  useEffect(() => {
    // Request permission to receive notifications (iOS only)
    if (Platform.OS === 'ios') {
      messaging()
        .requestPermission()
        .then((authStatus) => {
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (enabled) {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        });
    }

    // Get FCM token and store it in a constant
    const getAndStoreFcmToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
          // Store the FCM token in a constant variable
          const adminToken = fcmToken;
          // Send the token to the backend
          storeFcmToken(adminToken);
        } else {
          console.log('No FCM token found');
        }
      } catch (error) {
        console.error('Error retrieving FCM token:', error);
      }
    };

    getAndStoreFcmToken();

    // Handle background notification
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
    });

    // Handle when app is completely closed
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage.notification);
    });
  }, []);

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

