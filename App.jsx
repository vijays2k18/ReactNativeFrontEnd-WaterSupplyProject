import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Main from './components/main'; // Correct import (capitalize Main)
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Screen } from 'react-native-screens';
import AdminLogin from './components/adminlogin';
import UserLogin from './components/userlogin';
import AdminHome from './components/adminhome';
import Customer from './components/customer';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Main" screenOptions={{
          headerShown:false
        }}>
          <Stack.Screen name="Main" component={Main}/> 
          <Stack.Screen name="UserLogin" component={UserLogin}/> 
          <Stack.Screen name="AdminLogin" component={AdminLogin}/> 
          <Stack.Screen name="AdminHome" component={AdminHome}/>
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
