import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Main from './components/main'; // Correct import (capitalize Main)
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Screen } from 'react-native-screens';
import AdminLogin from './components/adminlogin';
import UserLogin from './components/userlogin';
import AdminHome from './components/adminhome';
import Customer from './components/customer';
import CustomerHome from './components/customerhome';
import { Provider as PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Alert, View, Text, Button, Platform } from 'react-native';



const Stack = createStackNavigator();
   
  const App = () => {

    useEffect(() => {
      if (Platform.OS === 'android') {
        requestNotificationPermission();
      }
   // Handle notifications in the foreground
   const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);
    Alert.alert('Notification Received', remoteMessage.notification.body);
  });
  
  // Background and quit state handler
  const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification caused app to open:', remoteMessage);
    Alert.alert('Notification Clicked', remoteMessage.notification.body);
  });
  
  const unsubscribeInitialNotification = messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from quit state by notification:', remoteMessage);
        Alert.alert('Notification Clicked (Quit State)', remoteMessage.notification.body);
      }
    });
  
    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
      unsubscribeInitialNotification();
    };
  
    }, []);

    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
  
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
          } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
            Alert.alert(
              'Permission Denied',
              'Notification permissions are required to stay updated. Please enable them in Settings.',
              [{ text: 'OK' }]
            );
          } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
              'Permission Blocked',
              'Notification permissions are blocked. Please enable them in Settings.',
              [{ text: 'OK' }]
            );
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
 
   return (
    <PaperProvider> 
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Main" screenOptions={{
          headerShown:false
        }}>
          <Stack.Screen name="Main" component={Main}/> 
          <Stack.Screen name="UserLogin" component={UserLogin}/> 
          <Stack.Screen name="AdminLogin" component={AdminLogin}/> 
          <Stack.Screen name="AdminHome" component={AdminHome}/>
          <Stack.Screen name="CustomerHome" component={CustomerHome}/>
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
