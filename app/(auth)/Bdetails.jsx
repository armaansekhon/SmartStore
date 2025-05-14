import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Keyboard,
  View,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import useFetchCategories from '../../hooks/useFetchCategories';
import useSaveBusinessDetails from '../../hooks/useSaveBusinessDetails';

const Bdetails = () => {
  const Router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [category, setCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For DropDownPicker

  const { categories, loading: categoriesLoading, error: categoriesError, refetch } = useFetchCategories();
  const { saveBusinessDetails, loading: submitLoading, error: submitError } = useSaveBusinessDetails();

  // Log categories for debugging
  console.log('Categories Data:', categories);

  // Map categories to DropDownPicker items
  const items = Array.isArray(categories)
    ? categories.map((item) => {
        const mappedItem = {
          label: item.label || 'Unknown',
          value: item.value || '',
        };
        return mappedItem;
      })
    : [];
  console.log('Mapped Dropdown Items:', items);

  const handleCategoryChange = (value) => {
    console.log('Dropdown Selected Value:', value);
    setCategory(value);
    console.log('Updated Category State:', value);
  };

  const handleSubmit = async () => {
    console.log('Submit - Current Category:', category);

    if (!businessName.trim()) {
      Alert.alert('Error', 'Business Name is required.');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a Category.');
      return;
    }
    if (!country.trim()) {
      Alert.alert('Error', 'Country is required.');
      return;
    }
    if (!state.trim()) {
      Alert.alert('Error', 'State is required.');
      return;
    }
    if (!addressLine1.trim()) {
      Alert.alert('Error', 'Address Line 1 is required.');
      return;
    }
    if (!zipCode.trim()) {
      Alert.alert('Error', 'Zip Code is required.');
      return;
    }

    const payload = {
      id: '-1',
      CategoryId: category,
      Name: businessName,
      Address1: addressLine1,
      Address2: addressLine2 || '',
      State: state,
      Country: country,
      ZipCode: zipCode,
    };

    try {
      console.log('Submitting Business Details:', payload);
      await saveBusinessDetails(payload);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        Router.replace('/(drawer)');
      }, 3000);
    } catch (err) {
      let errorMessage = submitError || 'Failed to save business details. Please try again.';
      if (submitError?.includes('Invalid ObjectId')) {
        errorMessage = 'Invalid category selected. Please choose a valid category.';
      } else if (submitError?.includes('Unauthorized')) {
        errorMessage = 'Session expired. Please log in again.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Clear all form fields
      setBusinessName('');
      setCountry('');
      setState('');
      setAddressLine1('');
      setAddressLine2('');
      setZipCode('');
      setCategory(null);
      

      // Refetch categories
      await refetch();
      console.log('Categories refetched successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh categories. Please try again.');
    } finally {
      setRefreshing(false);
      
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.outercontainer}>
        {showSuccess ? (
          <View style={styles.successContainer}>
            <LottieView
              source={require('../../assets/lottie/done.json')}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <Text style={styles.successText}>Business Details Saved Successfully</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#B295F8']}
                tintColor={'#B295F8'}
              />
            }
          >
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>LOGO HERE</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Business Details</Text>

              {categoriesError && (
                <Text style={styles.errorText}>Failed to load categories: {categoriesError}</Text>
              )}

              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#222' }]}
                placeholder="Joe Rogan"
                placeholderTextColor="#aaa"
                value={businessName}
                onChangeText={setBusinessName}
              />

              <Text style={styles.label}>Country</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#222' }]}
                placeholder="United States"
                placeholderTextColor="#aaa"
                value={country}
                onChangeText={setCountry}
              />

              <Text style={styles.label}>State</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#222' }]}
                placeholder="Nevada"
                placeholderTextColor="#aaa"
                value={state}
                onChangeText={setState}
              />

              <Text style={styles.label}>Business Location</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#222' }]}
                placeholder="Address Line 1"
                placeholderTextColor="#aaa"
                value={addressLine1}
                onChangeText={setAddressLine1}
              />
              <TextInput
                style={[styles.input, { backgroundColor: '#222' }]}
                placeholder="Address Line 2"
                placeholderTextColor="#aaa"
                value={addressLine2}
                onChangeText={setAddressLine2}
              />
              <TextInput
                style={[styles.input, { backgroundColor: '#222' }]}
                placeholder="Zip Code"
                placeholderTextColor="#aaa"
                value={zipCode}
                onChangeText={setZipCode}
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.dropdownContainer}>
                {items.length > 0 ? (
                  <DropDownPicker
                    open={dropdownOpen}
                    value={category}
                    items={items}
                    listMode='SCROLLVIEW'
                    setOpen={setDropdownOpen}
                    setValue={handleCategoryChange}
                    placeholder={categoriesLoading ? 'Loading Categories...' : 'Select Category'}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropDownContainerStyle={styles.dropdownList}
                    placeholderStyle={styles.placeholderText}
                    selectedItemContainerStyle={styles.selectedItem}
                    itemStyle={styles.dropdownItem}
                    searchable={true}
                    searchPlaceholder="Search categories..."
                    searchTextInputStyle={styles.searchInput}
                    searchContainerStyle={styles.searchContainer}
                    containerStyle={{ zIndex: 1000 }}
                    zIndex={1000}
                  />
                ) : (
                  <View style={styles.dropdown}>
                    <Text style={styles.dropdownText}>No categories available</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={{ width: '100%' }}
                onPress={handleSubmit}
                disabled={submitLoading || categoriesLoading || refreshing}
              >
                <LinearGradient
                  colors={['#4A47A3', '#B295F8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.button, (submitLoading || categoriesLoading || refreshing) && { opacity: 0.7 }]}
                >
                  <Text style={styles.buttonText}>
                    {submitLoading ? 'SUBMITTING...' : 'SUBMIT'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.scrollSpacer} />
          </ScrollView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outercontainer: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#111',
    paddingBottom: 200,
    minHeight: '100%',
    paddingVertical: 20,
  },
  logoPlaceholder: {
    alignSelf: 'baseline',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#4A47A3',
    shadowOpacity: 0.7,
    shadowOffset: { width: 1, height: -4 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 30,
    alignSelf: 'baseline',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#222',
  },
  label: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollSpacer: {
    height: 200,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  lottie: {
    width: 150,
    height: 150,
  },
  successText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownContainer: {
    padding: 0,
    width: '100%',
    zIndex: 1000,
    marginBottom: 30,
  },
  dropdown: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownList: {
    backgroundColor: '#222',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B295F8',
    maxHeight: 300,
  },
  dropdownText: {
    fontSize: 16,
    color: '#D9D9D9',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '400',
  },
  dropdownItem: {
    padding: 15,
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: '#4A47A3',
  },
  searchContainer: {
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    padding: 10,
  },
  searchInput: {
    borderRadius: 8,
    borderColor: '#B295F8',
    borderWidth: 1,
    color: '#D9D9D9',
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default Bdetails;