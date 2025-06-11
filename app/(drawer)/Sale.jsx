import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useFetchSales from '../../hooks/useFetchSales';
import useFetchVehicleSales from '../../hooks/useFetchVehicleSales';

// Service Configuration for Dynamic Services
const servicesConfig = {
  Mobile: {
    hook: useFetchSales,
    title: 'Sales',
    subtitle: 'Here is the list of items sold',
    fields: [
      { key: 'batteryHealth', label: 'Battery Health', type: 'battery', unit: '%' },
     
    ],
    statusKey: 'productStatus',
  },
  Vehicle: {
    hook: useFetchVehicleSales,
    title: 'Vehicle Sales',
    subtitle: 'Here is the list of vehicles sold',
    fields: [
      { key: 'model', label: 'Model', type: 'text', icon: 'car' },
      { key: 'tyrePercentage', label: 'Tyre Percentage', type: 'text', unit: '%' },
      { key: 'noOfKeys', label: 'Number of Keys', type: 'text' },
      { key: 'chassisNumber', label: 'Chassis Number', type: 'text' },
      { key: 'engineNumber', label: 'Engine Number', type: 'text' },
    ],
    statusKey: 'vehicleStatus',
  },
  // Add new services here, e.g.:
  // Laptop: {
  //   hook: useFetchLaptopSales,
  //   title: 'Laptop Sales',
  //   subtitle: 'Here is the list of laptops sold',
  //   fields: [...],
  //   statusKey: 'productStatus',
  // },
};

// Utility function for warranty status
const statusToWarranty = (item, statusKey) => {
  const statusValue = parseInt(item[statusKey]);
  switch (statusValue) {
    case 0: return 'Warranty';
    case 1: return 'Out of Warranty';
    case 2: return 'Damaged';
    case 3: return 'Lost';
    case 4: return 'Stolen';
    default: return 'Unknown';
  }
};

// Reusable Search Input Component
const CustomSearchInput = ({ value, onChangeText, placeholder, accessibilityLabel }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="#564dcc" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      accessibilityLabel={accessibilityLabel}
      returnKeyType="search"
    />
  </View>
);

// Reusable Dropdown Component
const CustomDropdown = ({ value, options, onSelect, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
        accessibilityLabel="Select sale time range"
        accessibilityRole="button"
      >
        <Text style={styles.dropdownButtonText}>
          {options.find(opt => opt.value === value)?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#564dcc" />
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdownModal}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value === null ? 'null' : option.value}
              style={[
                styles.dropdownOption,
                value === option.value && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onSelect(option.value);
                setVisible(false);
              }}
              accessibilityLabel={`Filter by ${option.label}`}
              accessibilityRole="button"
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Reusable Sale Item Component
const SaleItem = React.memo(({ item, serviceConfig, onEdit, isLoadingImages, setIsLoadingImages }) => {
  const warranty = statusToWarranty(item, serviceConfig.statusKey);

  return (
    <View
      style={styles.itemContainer}
      accessible
      accessibilityLabel={`${item.name || 'Unknown item'}, ₹${item.price || 'N/A'}, ${warranty}`}
      accessibilityRole="none"
    >
      {isLoadingImages[item.id] && (
        <ActivityIndicator size="small" color="#564dcc" style={styles.imageLoader} />
      )}
      <Image
        source={{ uri: item.image || 'https://placeimg.com/108/104/any' }}
        style={[styles.image, isLoadingImages[item.id] && { opacity: 0.5 }]}
        defaultSource={require('../../assets/images/icon.png')}
        onLoadStart={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: true }))}
        onLoad={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: false }))}
        onError={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: false }))}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name || 'Unknown'}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>{item.description || 'No description'}</Text>
        {serviceConfig.fields.map((field, index) => (
          field.type === 'battery' ? (
            <View key={index} style={styles.batteryContainer}>
              <Ionicons
                name={parseInt(item[field.key]) >= 90 ? 'battery-full' : parseInt(item[field.key]) >= 80 ? 'battery-half' : 'battery-dead'}
                size={18}
                color={parseInt(item[field.key]) >= 90 ? '#34d399' : parseInt(item[field.key]) >= 80 ? '#facc15' : '#f87171'}
                style={styles.batteryIcon}
              />
              <Text style={styles.batteryText}>{field.label}: {item[field.key] || 'N/A'}{field.unit || ''}</Text>
            </View>
          ) : (
            <View key={index} style={styles.fieldContainer}>
              {field.icon && <Ionicons name={field.icon} size={18} color="#333" style={styles.fieldIcon} />}
              <Text style={styles.fieldText}>{field.label}: {item[field.key] || 'N/A'}</Text>
            </View>
          )
        ))}
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>₹{item.price || 'N/A'}</Text>
          <View style={[
            styles.warrantyBadge,
            {
              backgroundColor:
                warranty === 'Warranty' ? '#e6f4ea' :
                warranty === 'Unknown' ? '#e0e0e0' : '#fee2e2',
            }
          ]}>
            <Text style={[
              styles.warrantyText,
              {
                color:
                  warranty === 'Warranty' ? '#16a34a' :
                  warranty === 'Unknown' ? '#666' : '#dc2626',
              }
            ]}>
              {warranty}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editIcon}
        onPress={onEdit}
        accessibilityLabel={`Edit ${item.name || 'Unknown item'}`}
        accessibilityRole="button"
      >
        <Ionicons name="settings-outline" size={20} color="#564dcc" />
      </TouchableOpacity>
    </View>
  );
});

// Reusable Empty List Component
const EmptyList = ({ searchQuery, error }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>
      {searchQuery ? 'No items match your search.' : error || 'No sale items available.'}
    </Text>
  </View>
);

// Reusable Footer Loader Component
const FooterLoader = ({ isLoading }) => (
  isLoading && (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="large" color="#564dcc" />
    </View>
  )
);

// Sale Component
const Sale = () => {
  const nav = useNavigation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [isServiceNameLoading, setIsServiceNameLoading] = useState(true);
  const [serviceNameError, setServiceNameError] = useState(null);
  const [isLoadingImages, setIsLoadingImages] = useState({});

  const dropdownOptions = [
    { label: 'All', value: null },
    { label: 'This Week', value: 7 },
    { label: 'This Month', value: 30 },
  ];

  // Fetch ServiceName from SecureStore
  useEffect(() => {
    const fetchServiceName = async () => {
      setIsServiceNameLoading(true);
      try {
        const storedServiceName = await SecureStore.getItemAsync('serviceName');
        if (storedServiceName) {
          setServiceName(storedServiceName);
        } else {
          console.warn('ServiceName not found in SecureStore, defaulting to "Mobile".');
          setServiceName('Mobile');
        }
      } catch (error) {
        const errorMessage = 'Failed to retrieve ServiceName from SecureStore.';
        console.error(errorMessage, error);
        setServiceNameError(errorMessage);
        setServiceName('Mobile'); // Fallback
      } finally {
        setIsServiceNameLoading(false);
      }
    };

    fetchServiceName();
  }, []);

  // Get service config or fallback to Mobile
  const serviceConfig = servicesConfig[serviceName] || servicesConfig.Mobile;

  // Use the service's fetch hook
  const { sales, isLoading, isInitialLoading, error, loadMore, refresh } = serviceConfig.hook(selectedDays);

  const filteredData = useMemo(() => (
    Array.isArray(sales)
      ? sales.filter(item =>
          item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []
  ), [sales, searchQuery]);

  const handleEdit = useCallback((id) => {
    router.push({ pathname: '/UpdateEntry', params: { id } });
  }, [router]);

  if (isServiceNameLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.loadingText}>Loading items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => nav.openDrawer()}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/AddEntry')}
          accessibilityLabel="Add new item"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>{serviceConfig.title}</Text>
          <Text style={styles.subtitleText}>{serviceConfig.subtitle}</Text>
        </View>
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/lottie/purchase.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
            onError={console.error}
          />
        </View>
      </View>

      <View style={styles.inputRow}>
        <CustomSearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${serviceConfig.title.toLowerCase()}...`}
          accessibilityLabel={`Search ${serviceName.toLowerCase()} items`}
        />
        <CustomDropdown
          value={selectedDays}
          options={dropdownOptions}
          onSelect={(value) => {
            setSelectedDays(value);
            refresh();
          }}
          placeholder="All"
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <SaleItem
            item={item}
            serviceConfig={serviceConfig}
            onEdit={() => handleEdit(item.id)}
            isLoadingImages={isLoadingImages}
            setIsLoadingImages={setIsLoadingImages}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        ListEmptyComponent={() => <EmptyList searchQuery={searchQuery} error={error || serviceNameError} />}
        ListFooterComponent={() => <FooterLoader isLoading={isLoading} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isInitialLoading}
        onRefresh={refresh}
      />
    </SafeAreaView>
  );
};

export default Sale;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    color: '#333',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  titleTextContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#564dcc',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  animationContainer: {
    width: 80,
    height: 80,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.1 }],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 160,
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 160,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownOptionSelected: {
    backgroundColor: '#e0e0ff',
  },
  dropdownOptionText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  imageLoader: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 4,
    borderRadius: 6,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 4,
    borderRadius: 6,
  },
  batteryIcon: {
    marginRight: 6,
  },
  fieldIcon: {
    marginRight: 6,
  },
  batteryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  fieldText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  warrantyBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  warrantyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});