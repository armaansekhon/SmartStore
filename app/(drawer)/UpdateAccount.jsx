import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert, Modal, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import useGetUserData from '../../hooks/useGetUserData';
import useSaveBusinessDetails from '../../hooks/useSaveBusinessDetails';

const UpdateAccountScreen = () => {
  const Nav = useNavigation();
  const { data, isLoading: fetchLoading, error: fetchError, refetch } = useGetUserData();
  const { saveBusinessDetails, loading: saveLoading, error: saveError } = useSaveBusinessDetails();

  // State for selected business detail
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
  });

  // State for dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBusinessIndex, setSelectedBusinessIndex] = useState(0);
  // State for save operation
  const [isSaving, setIsSaving] = useState(false);
  const Router=useRouter();

  // Load business details from fetched data
  useEffect(() => {
    if (data && data.length > 0 && data[0].bussinessDetail && data[0].bussinessDetail.length > 0) {
      const business = data[0].bussinessDetail[selectedBusinessIndex];
      setBusinessDetails({
        id: business.id || '',
        userId: data[0]._id || '',
        categoryId: business.categoryId || '',
        name: business.name || '',
        address1: business.address1 || '',
        address2: business.address2 || '',
        MobileNumber: business.mobileNumber||'',
        state: business.state || '',
        country: business.country || '',
        zipCode: business.zipCode || '',
      });
    }
  }, [data, selectedBusinessIndex]);

  // Handle refresh (pull-to-refresh or button)
  const handleRefresh = () => {
    setSelectedBusinessIndex(0); // Reset to first business
    refetch();
  };

  // Validate business details
  const validateBusinessDetails = () => {
    if (!businessDetails.id) {
      Alert.alert('Error', 'Business ID is required. Please select a business.');
      return false;
    }
    if (!businessDetails.name) {
      Alert.alert('Error', 'Business Name is required.');
      return false;
    }
    if (!businessDetails.address1) {
      Alert.alert('Error', 'Address Line 1 is required.');
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
    if (!businessDetails.zipCode || !/^\d{5,}$/.test(businessDetails.zipCode)) {
      Alert.alert('Error', 'Please enter a valid zip code (at least 5 digits).');
      return false;
    }
    return true;
  };

  // Save business details
  const handleSaveBusinessDetails = async () => {
    if (!validateBusinessDetails()) return;

    const payload = {
      id: businessDetails.id,
      UserId: businessDetails.userId,
      CategoryId: businessDetails.categoryId,
      Name: businessDetails.name,
      Address1: businessDetails.address1,
      Address2: businessDetails.address2,
      State: businessDetails.state,
      MobileNumber: businessDetails.mobileNumber,
      
      Country: businessDetails.country,
      ZipCode: businessDetails.zipCode,
    };

    try {
      setIsSaving(true);
      console.log('Saving Business Details:', JSON.stringify(payload, null, 2)); // Debug log
      await saveBusinessDetails(payload);
      Alert.alert('Success', 'Business details updated successfully.');
      refetch(); // Refresh data
      Router.back();
    } catch (err) {
      Alert.alert('Error', saveError || 'Failed to save business details.');
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  // Business selection dropdown options
  const businessOptions = data && data[0]?.bussinessDetail
    ? data[0].bussinessDetail.map((biz, index) => ({
        label: biz.name || `Business ${index + 1}`,
        value: index,
      }))
    : [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>  Router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Business Details</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          accessibilityLabel="Refresh business details"
          accessibilityRole="button"
          disabled={fetchLoading}
        >
          <Ionicons name="refresh" size={30} color={fetchLoading ? "#888" : "#fff"} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={fetchLoading}
            onRefresh={handleRefresh}
            colors={["#564dcc"]}
            tintColor="#564dcc"
          />
        }
      >
        <Text style={styles.pageTitle}>Update Business Details</Text>

        {fetchLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#564dcc" />
            <Text style={styles.loadingText}>Loading business details...</Text>
          </View>
        )}

        {fetchError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{fetchError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
              accessibilityLabel="Retry fetching business details"
              accessibilityRole="button"
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!fetchLoading && !fetchError && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Business Details</Text>

           

            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              value={businessDetails.name}
              onChangeText={(text) => setBusinessDetails({ ...businessDetails, name: text })}
              placeholder="Enter business name"
              placeholderTextColor="#888"
              accessibilityLabel="Business Name"
            />

            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              style={styles.input}
              value={businessDetails.address1}
              onChangeText={(text) => setBusinessDetails({ ...businessDetails, address1: text })}
              placeholder="Enter address line 1"
              placeholderTextColor="#888"
              accessibilityLabel="Address Line 1"
            />

            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              value={businessDetails.address2}
              onChangeText={(text) => setBusinessDetails({ ...businessDetails, address2: text })}
              placeholder="Enter address line 2"
              placeholderTextColor="#888"
              accessibilityLabel="Address Line 2"
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

            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={styles.input}
              value={businessDetails.zipCode}
              onChangeText={(text) => setBusinessDetails({ ...businessDetails, zipCode: text })}
              placeholder="Enter zip code"
              placeholderTextColor="#888"
              keyboardType="numeric"
              accessibilityLabel="Zip Code"
            />
             <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={businessDetails.MobileNumber}
              onChangeText={(text) => setBusinessDetails({ ...businessDetails, MobileNumber: text })}
              placeholder="Enter Mobile Number"
              placeholderTextColor="91XXX-XXXXX"
              keyboardType="numeric"
              accessibilityLabel="Mobile Number"
            />

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSaveBusinessDetails}
              disabled={isSaving}
              accessibilityLabel="Save business details"
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>
                {isSaving ? 'Saving...' : 'Save Business Details'}
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
    width: 30,
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
  disabledButton: {
    backgroundColor: '#3a3a3a',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  dropdownContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    width: '80%',
    padding: 10,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#fff',
  },
});