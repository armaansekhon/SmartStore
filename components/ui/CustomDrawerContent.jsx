import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
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
import useLogout from '../../hooks/useLogout';
import * as SecureStore from 'expo-secure-store'

const drawerItems = [
  { label: 'Home', icon: <MaterialIcons name="house" size={22} color="#374151" />, route: '/' },
  { label: 'Sale', icon: <MaterialIcons name="sell" size={22} color="#374151" />, route: '/Sale' },
  { label: 'Purchase', icon: <Feather name="shopping-bag" size={22} color="#374151" />, route: '/Purchase' },
  { label: 'Inventory', icon: <Ionicons name="cube-outline" size={22} color="#374151" />, route: 'Inventory' },
  { label: 'Add Entry', icon: <Ionicons name="add" size={22} color="#374151" />, route: 'AddEntry' },
  { label: 'Account', icon: <MaterialIcons name="person-outline" size={22} color="#374151" />, route: 'Account' },
  { label: 'Change Password', icon: <Feather name="key" size={22} color="#374151" />, route: 'ChangePass' },
  { label: 'Logout', icon: <MaterialIcons name="logout" size={22} color="#374151" /> }, // No route for Logout
];

const CustomDrawerContent = (props) => {
  const Router = useRouter();
  const { logout, isLoading, error } = useLogout();
  const statusBarHeight = getStatusBarHeight();

  const name=SecureStore.getItem('username')

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully.');
    } catch (err) {
      Alert.alert('Error', error || 'Failed to log out.');
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, padding: 0 }}
    >
      {/* Custom header without SafeAreaView */}
      <LinearGradient
        colors={['#564dcc', '#564dcc']}
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
            onPress={
              item.label === 'Logout'
                ? handleLogout
                : () => Router.push(item.route)
            }
            style={styles.drawerItem}
            disabled={item.label === 'Logout' && isLoading}
          >
            <View style={styles.iconLabel}>
              {item.icon}
              <Text style={styles.label}>
                {item.label === 'Logout' && isLoading ? 'Logging out...' : item.label}
              </Text>
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
    height: '28%',
    left: -20,
    marginTop: -100,
    marginBottom: 20,
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
    zIndex: 10,
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
    fontSize: 18,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 12,
  },
});

export default CustomDrawerContent;