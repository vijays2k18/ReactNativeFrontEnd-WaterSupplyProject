import { StyleSheet, Text, View,Image,SafeAreaView,Button } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const Main = () => {
  const navigation = useNavigation();
  const customerHandler = () =>{
    navigation.navigate('UserLogin')
  }
  const adminHandler = () =>{
    navigation.navigate('AdminLogin')
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Customer Login" onPress={customerHandler} />
        <View style={styles.buttonSpacing} />
        <Button title="Admin Login" onPress={adminHandler} />
      </View>
    </SafeAreaView>
  )
}

export default Main

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff5ee', // Light green background // dcdcdc,fff5ee
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
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 300,
    },
    buttonSpacing: {
      width: 20, 
    },
  });
  