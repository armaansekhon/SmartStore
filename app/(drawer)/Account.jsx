import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const AccountScreen = () => {
  const Nav = useNavigation();

  // Placeholder user and business data
  const userDetails = {
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
  };

  const businessDetails = {
    businessName: 'Doe Enterprises',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    city: 'Springfield',
    state: 'Illinois',
    country: 'USA',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => Nav.openDrawer()}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity
          onPress={() => Nav.navigate('UpdateAccount', { userDetails, businessDetails })}
          accessibilityLabel="Edit account details"
          accessibilityRole="button"
        >
          <Ionicons name="pencil" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Account</Text>

        {/* User Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Username</Text>
            <Text style={styles.detailValue}>{userDetails.username}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email ID</Text>
            <Text style={styles.detailValue}>{userDetails.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{userDetails.phoneNumber}</Text>
          </View>
        </View>

        {/* Business Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Business Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Business Name</Text>
            <Text style={styles.detailValue}>{businessDetails.businessName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{businessDetails.phoneNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{businessDetails.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>{businessDetails.city}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>State</Text>
            <Text style={styles.detailValue}>{businessDetails.state}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Country</Text>
            <Text style={styles.detailValue}>{businessDetails.country}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

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
    color: '#564dcc',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ccc',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    flex: 2,
    textAlign: 'right',
  },
});