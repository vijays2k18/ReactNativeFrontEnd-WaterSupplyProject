import React, { useEffect } from 'react';
import { Platform, View, Button, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const Notification = () => {
  // Function to store the FCM token in the backend
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
    
  const storeFcmToken = async (adminToken) => {
    try {
      const user_id = 6;  // Replace with the actual user ID
      const response = await fetch('http://nodejs-api.pixelsscreen.com/admintoken/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          admin_token: adminToken, // Pass the stored FCM token
        }),
      });
      
      const responseText = await response.text();
      console.log('Raw Response Text:', responseText);
      
      try {
        const responseBody = JSON.parse(responseText); // Explicitly parse as JSON
        console.log('Parsed Response Body:', responseBody);
      
        if (response.ok) {
          console.log('Admin token saved successfully');
        } else {
          console.error('Error saving admin token:', responseBody.message);
        }
      } catch (parseError) {
        console.error('Error parsing server response:', parseError, responseText);
      }
    } catch (error) {
      console.error('Error storing FCM token:', error);
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

  // Function to send notification request
  const sendNotificationRequest = async () => {
    try {
      const response = await fetch('http://nodejs-api.pixelsscreen.com/admin/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'This is a test notification',
          userId: 6, // Replace with the actual user ID
        }),
      });
  
      // Log the response status and full response
      console.log('Response Status:', response.status);
      const responseData = await response.json();
      console.log('Response Data:', responseData);
  
      if (response.ok) {
        console.log('Notification sent successfully:', responseData);
      } else {
        console.error('Error sending notification:', responseData.error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Button
        title="Request Notification"
        onPress={sendNotificationRequest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notification;
