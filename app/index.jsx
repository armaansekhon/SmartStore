import { StyleSheet, Text, View, } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
const index = () => {

  const Router=useRouter();
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      Router.replace('/login');
    }, 0); // Wait until after mount

    return () => clearTimeout(timeout);
  }, []);
  return (
    <SafeAreaProvider>
     <Text>Hello</Text>
    </SafeAreaProvider>
  )
}

export default index

const styles = StyleSheet.create({})