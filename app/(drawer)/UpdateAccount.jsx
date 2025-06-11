import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import useGetUserData from '../../hooks/useGetUserData';
import useSaveBusinessDetails from '../../hooks/useSaveBusinessDetails';

// Reusable Header Component
const Header = ({ onBackPress, onRefreshPress, title, isRefreshing }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBackPress}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Ionicons name="chevron-back" size={28} color="#333333" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity
      onPress={onRefreshPress}
      accessibilityLabel="Refresh business details"
      accessibilityRole="button"
      disabled={isRefreshing}
    >
      <Ionicons name="refresh" size={28} color={isRefreshing ? "#666666" : "#333333"} />
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
      accessibilityLabel="Retry fetching business details"
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

// Reusable Form Field Component
const FormField = React.memo(({ label, value, onChange, placeholder, keyboardType, accessibilityLabel }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      keyboardType={keyboardType || 'default'}
      accessibilityLabel={accessibilityLabel}
    />
  </View>
));

// Form Configuration
const formConfig = [
  { key: 'name', label: 'Business Name', placeholder: 'Enter business name', required: true },
  { key: 'address1', label: 'Address Line 1', placeholder: 'Enter address line 1', required: true },
  { key: 'address2', label: 'Address Line 2', placeholder: 'Enter address line 2' },
  { key: 'state', label: 'State', placeholder: 'Enter state', required: true },
  { key: 'country', label: 'Country', placeholder: 'Enter country', required: true },
  { key: 'zipCode', label: 'Zip Code', placeholder: 'Enter zip code', keyboardType: 'numeric', required: true },
  { key: 'mobileNumber', label: 'Mobile Number', placeholder: 'Enter mobile number', keyboardType: 'numeric', required: true },
];

// UpdateAccountScreen Component
const UpdateAccountScreen = () => {
  const nav = useNavigation();
  const router = useRouter();
  const { data, isLoading: fetchLoading, error: fetchError, refetch } = useGetUserData();
  const { saveBusinessDetails, loading: saveLoading, error: saveError } = useSaveBusinessDetails();

  const [businessDetails, setBusinessDetails] = useState({
    id: '',
    userId: '',
    categoryId: '',
    name: '',
    address1: '',
    address2: '',
    state: '',
    country: '',
    zipCode: '',
    mobileNumber: '',
  });

  // Load business details
  useEffect(() => {
    if (data && data.length > 0 && data[0].businessDetail && data[0].businessDetail.length > 0) {
      const business = data[0].businessDetail[0]; // Use first business
      setBusinessDetails({
        id: business.id || '',
        userId: data[0]._id || '',
        categoryId: business.categoryId || '',
        name: business.name || '',
        address1: business.address1 || '',
        address2: business.address2 || '',
        state: business.state || '',
        country: business.country || '',
        zipCode: business.zipCode || '',
        mobileNumber: business.mobileNumber || '',
      });
    }
  }, [data]);

  // Handle form input changes
  const handleChange = useCallback((key, value) => {
    setBusinessDetails(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Validate business details
  const validateBusinessDetails = useCallback(() => {
    for (const field of formConfig) {
      if (field.required && !businessDetails[field.key]) {
        Alert.alert('Error', `${field.label} is required.`);
        return false;
      }
    }
    if (!businessDetails.zipCode || !/^\d{5,}$/.test(businessDetails.zipCode)) {
      Alert.alert('Error', 'Please enter a valid zip code (at least 5 digits).');
      return false;
    }
    if (!businessDetails.mobileNumber || !/^\d{10}$/.test(businessDetails.mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  }, [businessDetails]);

  // Save business details
  const handleSaveBusinessDetails = useCallback(async () => {
    if (!validateBusinessDetails()) return;

    const payload = {
      id: businessDetails.id,
      UserId: businessDetails.userId,
      CategoryId: businessDetails.categoryId,
      Name: businessDetails.name,
      Address1: businessDetails.address1,
      Address2: businessDetails.address2,
      State: businessDetails.state,
      Country: businessDetails.country,
      ZipCode: businessDetails.zipCode,
      MobileNumber: businessDetails.mobileNumber,
    };

    try {
      await saveBusinessDetails(payload);
      Alert.alert('Success', 'Business details updated successfully.', [{ text: 'OK', onPress: () => router.back() }]);
      refetch();
    } catch (err) {
      Alert.alert('Error', saveError || 'Failed to save business details.');
    }
  }, [businessDetails, saveBusinessDetails, saveError, refetch, router]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBackPress={() => router.back()}
        onRefreshPress={handleRefresh}
        title="Update Business Details"
        isRefreshing={fetchLoading}
      />
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={fetchLoading}
            onRefresh={handleRefresh}
            colors={["#564DCC"]}
            tintColor="#564DCC"
          />
        }
      >
        <Text style={styles.pageTitle}>Update Business Details</Text>
        {fetchLoading && <LoadingSpinner message="Loading business details..." />}
        {fetchError && <ErrorView message={fetchError} onRetry={handleRefresh} />}
        {!fetchLoading && !fetchError && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Business Details</Text>
            {formConfig.map(field => (
              <FormField
                key={field.key}
                label={field.label}
                value={businessDetails[field.key]}
                onChange={(text) => handleChange(field.key, text)}
                placeholder={field.placeholder}
                keyboardType={field.keyboardType}
                accessibilityLabel={field.label}
              />
            ))}
            <TouchableOpacity
              style={[styles.saveButton, saveLoading && styles.disabledButton]}
              onPress={handleSaveBusinessDetails}
              disabled={saveLoading}
              accessibilityLabel="Save business details"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>
                {saveLoading ? 'Saving...' : 'Save Business Details'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateAccountScreen;

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
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#564DCC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 15,
  },
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.7,
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
});