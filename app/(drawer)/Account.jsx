import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import useGetUserData from '../../hooks/useGetUserData';

// Reusable Header Component
const Header = ({ onMenuPress, onEditPress, title }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onMenuPress}
      accessibilityLabel="Open menu"
      accessibilityRole="button"
    >
      <Ionicons name="menu" size={28} color="#333333" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity
      onPress={onEditPress}
      accessibilityLabel="Edit account details"
      accessibilityRole="button"
    >
      <Ionicons name="settings" size={24} color="#564DCC" />
    </TouchableOpacity>
  </View>
);

// Reusable Error View Component
const ErrorView = ({ message, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity
      style={styles.button}
      onPress={onRetry}
      accessibilityLabel="Retry fetching user data"
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

// Reusable Loading Spinner Component
const LoadingSpinner = ({ message }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#564DCC" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

// Reusable Detail Row Component
const DetailRow = React.memo(({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
));

// Reusable Detail Card Component
const DetailCard = React.memo(({ title, details }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {details.map((detail, index) => (
      <DetailRow key={index} label={detail.label} value={detail.value} />
    ))}
  </View>
));

// Details Configuration
const detailsConfig = {
  user: {
    title: 'User Details',
    fields: [
      { key: 'userName', label: 'Username' },
      { key: 'email', label: 'Email ID' },
    ],
  },
  business: {
    title: 'Business Details',
    fields: [
      { key: 'businessName', label: 'Business Name' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'address', label: 'Address' },
      { key: 'state', label: 'State' },
      { key: 'country', label: 'Country' },
    ],
  },
};

// AccountScreen Component
const AccountScreen = () => {
  const nav = useNavigation();
  const { data, isLoading, error, refetch } = useGetUserData();

  // Memoized user and business details
  const { userDetails, businessDetails } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        userDetails: { userName: 'N/A', email: 'N/A' },
        businessDetails: {
          businessName: 'N/A',
          phoneNumber: 'N/A',
          address: 'N/A',
          state: 'N/A',
          country: 'N/A',
        },
      };
    }

    const userData = data[0];
    const businessData = userData.bussinessDetail && userData.bussinessDetail.length > 0 ? userData.bussinessDetail[0] : {};

    return {
      userDetails: {
        userName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'N/A',
        email: userData.email || 'N/A',
      },
      businessDetails: {
        businessName: businessData.name || 'N/A',
        phoneNumber: businessData.mobileNumber || 'N/A',
        address: `${businessData.address1 || ''} ${businessData.address2 || ''}`.trim() || 'N/A',
        state: businessData.state || 'N/A',
        country: businessData.country || 'N/A',
      },
    };
  }, [data]);

  // Handle edit navigation
  const handleEdit = useCallback(() => {
    nav.navigate('UpdateAccount', { userDetails, businessDetails });
  }, [nav, userDetails, businessDetails]);

  // Dynamic detail sections
  const detailSections = useMemo(() => [
    {
      ...detailsConfig.user,
      details: detailsConfig.user.fields.map(field => ({
        label: field.label,
        value: userDetails[field.key] || 'N/A',
      })),
    },
    {
      ...detailsConfig.business,
      details: detailsConfig.business.fields.map(field => ({
        label: field.label,
        value: businessDetails[field.key] || 'N/A',
      })),
    },
  ], [userDetails, businessDetails]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onMenuPress={() => nav.openDrawer()}
        onEditPress={handleEdit}
        title="Account"
      />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Account</Text>
        {isLoading && <LoadingSpinner message="Loading user data..." />}
        {error && <ErrorView message={error} onRetry={refetch} />}
        {!isLoading && !error && detailSections.map((section, index) => (
          <DetailCard
            key={index}
            title={section.title}
            details={section.details}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#564DCC',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#564DCC',
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
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    flex: 2,
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#333333',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#564DCC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});