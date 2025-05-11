import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '../../components/ui/CustomDrawerContent';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function Layout() {

  const Router=useRouter()
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#1d4ed8',
        drawerInactiveTintColor: '#374151',
        drawerLabelStyle: { fontSize: 16 },
        drawerStyle: { backgroundColor: '#f9fafb' },
        headerStyle: {
          height: 190,
          paddingTop: 10,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleContainerStyle: {
          marginBottom: 35, // Move title upward (adjust as needed)
        },
        headerLeftContainerStyle: {
          marginBottom: 35, // Move drawer toggle icon upward (adjust as needed)
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#5B68DF', '#A270C1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={30}
             
              color="#fff"
              style={{
                marginRight: 15,
                marginBottom: 35, // Move bell icon upward (adjust as needed)
              }}
              onPress={() => Router.push('Notification')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Notification"
        options={{
          title: 'Notification',
          headerLeft: () => (
            <Ionicons
              name="chevron-back"
              size={30}
             
              color="#fff"
              style={{
                marginRight: 15,
                marginBottom: 35, // Move bell icon upward (adjust as needed)
              }}
              onPress={() => Router.back()}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Purchase"
        options={{
          title: 'Purchase',
          headerRight: () => (
            <Ionicons
              name="add"
              size={30}
             
              color="#fff"
              style={{
                marginRight: 15,
                marginBottom: 35, // Move bell icon upward (adjust as needed)
              }}
              onPress={() => Router.back()}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Sale"
        options={{
          title: 'Sale',
          headerRight: () => (
            <Ionicons
              name="add"
              size={30}
             
              color="#fff"
              style={{
                marginRight: 15,
                marginBottom: 35, // Move bell icon upward (adjust as needed)
              }}
              onPress={() => Router.back()}
            />
          ),
        }}
      />
       <Drawer.Screen
        name="Inventory"
        options={{
          title: 'Inventory',
          headerRight: () => (
            <Ionicons
              name="add"
              size={30}
             
              color="#fff"
              style={{
                marginRight: 15,
                marginBottom: 35, // Move bell icon upward (adjust as needed)
              }}
              onPress={() => Router.back()}
            />
          ),
        }}
      />
  
  
    </Drawer>
    
  );
}