import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const Account = () => {

  const Router=useRouter();

  useEffect(()=>{
    Router.replace("/")

    

  })
  return (
    <View>
      <Text>Account</Text>
    </View>
  )
}

export default Account

const styles = StyleSheet.create({})