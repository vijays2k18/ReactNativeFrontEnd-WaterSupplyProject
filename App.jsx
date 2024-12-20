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
import { PermissionsAndroid } from 'react-native';


const Stack = createStackNavigator();
   
  const App = () => {
 
    useEffect(() => {
      requestNotificationPermission();
    }, []);
  
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android') {
        // Request notification permission for Android 13 and above
        if (Platform.Version >= 33) {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Android notification permission granted.');
            } else {
              console.log('Android notification permission denied.');
            }
          } catch (error) {
            console.error('Error requesting Android notification permission:', error);
          }
        } else {
          console.log('Notification permissions are automatically granted for Android versions below 13.');
        }
      } else if (Platform.OS === 'ios') {
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
          if (enabled) {
            console.log('iOS notification permission granted.');
          } else {
            console.log('iOS notification permission denied.');
          }
        } catch (error) {
          console.error('Error requesting iOS notification permission:', error);
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
