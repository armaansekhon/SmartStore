import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import useGetUserData from '../../hooks/useGetUserData'

const AccountScreen = () => {
  const Nav = useNavigation();
  const { data, isLoading, error, refetch } = useGetUserData();

  // Map API response to expected userDetails and businessDetails
  const userDetails = data && data.length > 0
    ? {
        userName: `${data[0].firstName || ''} ${data[0].lastName || ''}`.trim() || 'N/A',
        email: data[0].email || 'N/A',
       
      }
    : { userName: 'N/A', email: 'N/A', phoneNumber: 'N/A' };

  // Use the first business detail entry (can be enhanced to select one)
  const businessDetails = data && data.length > 0 && data[0].bussinessDetail && data[0].bussinessDetail.length > 0
    ? {
        businessName: data[0].bussinessDetail[0].name || 'N/A',
        phoneNumber: data[0].bussinessDetail[0].mobileNumber || 'N/A', // Assuming same as user mobileNumber; adjust if separate
        address: `${data[0].bussinessDetail[0].address1 || ''} ${data[0].bussinessDetail[0].address2 || ''}`.trim() || 'N/A',
       
        state: data[0].bussinessDetail[0].state || 'N/A',
        country: data[0].bussinessDetail[0].country || 'N/A',
      }
    : {
        businessName: 'N/A',
        phoneNumber: 'N/A',
        address: 'N/A',
        city: 'N/A',
        state: 'N/A',
        country: 'N/A',
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

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#564dcc" />
            <Text style={styles.loadingText}>Loading user data...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refetch}
              accessibilityLabel="Retry fetching user data"
              accessibilityRole="button"
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !error && (
          <>
            {/* User Details Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>User Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Username</Text>
                <Text style={styles.detailValue}>{userDetails.userName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email ID</Text>
                <Text style={styles.detailValue}>{userDetails.email}</Text>
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
                <Text style={styles.detailLabel}>State</Text>
                <Text style={styles.detailValue}>{businessDetails.state}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Country</Text>
                <Text style={styles.detailValue}>{businessDetails.country}</Text>
              </View>
            </View>
          </>
        )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#564dcc',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});