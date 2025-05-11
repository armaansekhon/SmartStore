import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  MaterialIcons,
  Feather,
  Ionicons,
} from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const drawerItems = [
  { label: 'Sale', icon: <MaterialIcons name="sell" size={22} color="#374151" />, route: '/Sale' },
  { label: 'Purchase', icon: <Feather name="shopping-bag" size={22} color="#374151" />, route: '/Purchase' },
  { label: 'Inventory', icon: <Ionicons name="cube-outline" size={22} color="#374151" />, route: 'Inventory' },
  { label: 'Search Inventory', icon: <Feather name="search" size={22} color="#374151" />, route: 'search-inventory' },
  { label: 'Account', icon: <MaterialIcons name="person-outline" size={22} color="#374151" />, route: 'Account' },
  { label: 'Change Password', icon: <Feather name="key" size={22} color="#374151" />, route: 'ChangePass' },
  { label: 'Logout', icon: <MaterialIcons name="logout" size={22} color="#374151" />, route: 'logout' },
];

const CustomDrawerContent = (props) => {
const Router=useRouter();
  const statusBarHeight = getStatusBarHeight();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, padding: 0 }}
    >
      {/* Custom header without SafeAreaView */}
      <LinearGradient
        colors={['#5B68DF', '#A270C1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: statusBarHeight + 20 }]} // extra space for notch
      >
        <View style={styles.userInfo}>
        <Image
      source={{ uri: 'https://i.pravatar.cc/100' }}
      style={styles.avatar}
    />
          <View>
            <Text style={styles.name}>Amritpal Singh</Text>
            <Text style={styles.email}>amrit@gmail.com</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Drawer Items */}
      <View style={styles.drawerContent}>
        {drawerItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => Router.push(item.route)}
            style={styles.drawerItem}
          >
            <View style={styles.iconLabel}>
              {item.icon}
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <View style={styles.divider} />
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
   
    paddingHorizontal: 20,
   
    width: '120%',
    height:'28%',
    left:-20,
    marginTop:-100,
    marginBottom:20,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  userInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    zIndex:10,
    
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: '#fff',
    fontSize: 13,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  drawerItem: {
    paddingVertical: 12,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 12,
  },
});

export default CustomDrawerContent;
