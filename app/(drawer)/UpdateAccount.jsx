import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const UpdateAccountScreen = () => {
  const Nav = useNavigation();
  const params = useLocalSearchParams();

  // State for user details
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    phoneNumber: '',
  });

  // State for business details
  const [businessDetails, setBusinessDetails] = useState({
    businessName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Prioritize navigation params
        if (params.userDetails) {
          setUserDetails(JSON.parse(params.userDetails));
        } else {
          // Fallback to SecureStore
          const storedUserDetails = await SecureStore.getItemAsync('userDetails');
          if (storedUserDetails) {
            setUserDetails(JSON.parse(storedUserDetails));
          } else {
            // Default placeholder data
            setUserDetails({
              username: 'JohnDoe',
              email: 'john.doe@example.com',
              phoneNumber: '+1234567890',
            });
          }
        }

        if (params.businessDetails) {
          setBusinessDetails(JSON.parse(params.businessDetails));
        } else {
          // Fallback to SecureStore
          const storedBusinessDetails = await SecureStore.getItemAsync('businessDetails');
          if (storedBusinessDetails) {
            setBusinessDetails(JSON.parse(storedBusinessDetails));
          } else {
            // Default placeholder data
            setBusinessDetails({
              businessName: 'Doe Enterprises',
              phoneNumber: '+1234567890',
              address: '123 Main St',
              city: 'Springfield',
              state: 'Illinois',
              country: 'USA',
            });
          }
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load account details.');
      }
    };
    loadData();
  }, [params]);

  // Validate user details
  const validateUserDetails = () => {
    if (!userDetails.username) {
      Alert.alert('Error', 'Username is required.');
      return false;
    }
    if (!userDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    if (!userDetails.phoneNumber || !/^\+/.test(userDetails.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number starting with +.');
      return false;
    }
    return true;
  };

  // Validate business details
  const validateBusinessDetails = () => {
    if (!businessDetails.businessName) {
      Alert.alert('Error', 'Business Name is required.');
      return false;
    }
    if (!businessDetails.phoneNumber || !/^\+/.test(businessDetails.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid business phone number starting with +.');
      return false;
    }
    if (!businessDetails.address) {
      Alert.alert('Error', 'Address is required.');
      return false;
    }
    if (!businessDetails.city) {
      Alert.alert('Error', 'City is required.');
      return false;
    }
    if (!businessDetails.state) {
      Alert.alert('Error', 'State is required.');
      return false;
    }
    if (!businessDetails.country) {
      Alert.alert('Error', 'Country is required.');
      return false;
    }
    return true;
  };

  // Save user details
  const handleSaveUserDetails = async () => {
    if (!validateUserDetails()) return;

    try {
      await SecureStore.setItemAsync('userDetails', JSON.stringify(userDetails));
      Alert.alert('Success', 'User details updated successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save user details.');
    }
  };

  // Save business details
  const handleSaveBusinessDetails = async () => {
    if (!validateBusinessDetails()) return;

    try {
      await SecureStore.setItemAsync('businessDetails', JSON.stringify(businessDetails));
      Alert.alert('Success', 'Business details updated successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save business details.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => Nav.goBack()}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Update Account</Text>

        {/* User Details Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update User Details</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={userDetails.username}
            onChangeText={(text) => setUserDetails({ ...userDetails, username: text })}
            placeholder="Enter username"
            placeholderTextColor="#888"
            accessibilityLabel="Username"
          />
          <Text style={styles.label}>Email ID</Text>
          <TextInput
            style={styles.input}
            value={userDetails.email}
            onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
            placeholder="Enter email address"
            placeholderTextColor="#888"
            keyboardType="email-address"
            accessibilityLabel="Email ID"
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={userDetails.phoneNumber}
            onChangeText={(text) => setUserDetails({ ...userDetails, phoneNumber: text })}
            placeholder="Enter phone number (e.g., +1234567890)"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            accessibilityLabel="Phone Number"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveUserDetails}
            accessibilityLabel="Save user details"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Save User Details</Text>
          </TouchableOpacity>
        </View>

        {/* Business Details Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update Business Details</Text>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={businessDetails.businessName}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, businessName: text })}
            placeholder="Enter business name"
            placeholderTextColor="#888"
            accessibilityLabel="Business Name"
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={businessDetails.phoneNumber}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, phoneNumber: text })}
            placeholder="Enter phone number (e.g., +1234567890)"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            accessibilityLabel="Business Phone Number"
          />
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={businessDetails.address}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, address: text })}
            placeholder="Enter address"
            placeholderTextColor="#888"
            accessibilityLabel="Address"
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={businessDetails.city}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, city: text })}
            placeholder="Enter city"
            placeholderTextColor="#888"
            accessibilityLabel="City"
          />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={businessDetails.state}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, state: text })}
            placeholder="Enter state"
            placeholderTextColor="#888"
            accessibilityLabel="State"
          />
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={businessDetails.country}
            onChangeText={(text) => setBusinessDetails({ ...businessDetails, country: text })}
            placeholder="Enter country"
            placeholderTextColor="#888"
            accessibilityLabel="Country"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveBusinessDetails}
            accessibilityLabel="Save business details"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Save Business Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSpacer: {
    width: 30, // Balances the menu icon for centered title
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#564dcc',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  saveButton: {
    backgroundColor: '#564dcc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});