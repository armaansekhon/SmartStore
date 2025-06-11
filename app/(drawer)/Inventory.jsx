import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, TouchableOpacity,TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Mock hooks (replace with actual implementations)
const useFetchInventory = () => ({
  items: [], // Placeholder for mobile inventory
  isLoading: false,
  isInitialLoading: false,
  error: null,
  loadMore: () => {},
  refresh: () => {},
});

const useFetchVehicleInventory = () => ({
  items: [], // Placeholder for vehicle inventory
  isLoading: false,
  isInitialLoading: false,
  error: null,
  loadMore: () => {},
  refresh: () => {},
});

// Service Configuration
const servicesConfig = {
  Mobile: {
    hook: useFetchInventory,
    title: 'Inventory',
    subtitle: 'Here is the list of items in inventory',
    fields: [
      { key: 'batteryHealth', label: 'Battery Health', type: 'battery', unit: '%' },
    ],
    statusKey: 'vehicleStatus',
  },
  Vehicle: {
    hook: useFetchVehicleInventory,
    title: 'Vehicle Inventory',
    subtitle: 'Here is the list of vehicles in inventory',
    fields: [
      { key: 'tyrePercentage', label: 'Tyre Percentage', type: 'tyre', unit: '%' },
      { key: 'noOfKeys', label: 'Number of Keys', type: 'text' },
      { key: 'model', label: 'Model', type: 'text', icon: 'car' },
    ],
    statusKey: 'vehicleStatus',
  },
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

// Reusable Header Component
const Header = ({ onMenuPress, onAddPress }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onMenuPress}
      accessibilityLabel="Open menu"
      accessibilityRole="button"
    >
      <Ionicons name="menu" size={28} color="#333333" />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onAddPress}
      accessibilityLabel="Add new item"
      accessibilityRole="button"
    >
      <Ionicons name="add" size={28} color="#333333" />
    </TouchableOpacity>
  </View>
);

// Reusable Title Section Component
const TitleSection = ({ title, subtitle }) => (
  <View style={styles.titleContainer}>
    <View style={styles.titleTextContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subtitleText}>{subtitle}</Text>
    </View>
    <View style={styles.animationContainer}>
      <LottieView
        source={require('../../assets/lottie/inventory.json')}
        autoPlay
        loop
        speed={0.7}
        style={styles.lottieAnimation}
        onError={console.error}
      />
    </View>
  </View>
);

// Reusable Search Input Component (from Purchase.js)
const CustomSearchInput = ({ value, onChangeText, placeholder, accessibilityLabel }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="#564DCC" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      value={value}
      onChangeText={onChangeText}
      accessibilityLabel={accessibilityLabel}
      returnKeyType="search"
    />
  </View>
);

// Reusable Inventory Item Component (adapted from PurchaseItem)
const InventoryItem = React.memo(({ item, serviceConfig, isLoadingImages, setIsLoadingImages }) => {
  const warranty = statusToWarranty(item, serviceConfig.statusKey);

  return (
    <View
      style={styles.itemContainer}
      accessible
      accessibilityLabel={`${item.name || 'Unknown item'}, ${item.price || 'N/A'}, ${warranty}`}
    >
      {isLoadingImages[item.id] && (
        <ActivityIndicator size="small" color="#564DCC" style={styles.imageLoader} />
      )}
      <Image
        source={{ uri: item.image || 'https://placeimg.com/108/104/tech' }}
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
          field.type === 'battery' || field.type === 'tyre' ? (
            <View key={index} style={styles.batteryContainer}>
              <Ionicons
                name={
                  field.type === 'battery'
                    ? parseInt(item[field.key]) >= 90
                      ? 'battery-full'
                      : parseInt(item[field.key]) >= 80
                      ? 'battery-half'
                      : 'battery-dead'
                    : 'car'
                }
                size={18}
                color={
                  parseInt(item[field.key]) >= 80
                    ? '#34D399'
                    : parseInt(item[field.key]) >= 50
                    ? '#FACC15'
                    : '#F87171'
                }
                style={styles.batteryIcon}
              />
              <Text style={styles.batteryText}>
                {field.label}: {item[field.key] || 'N/A'}{field.unit || ''}
              </Text>
            </View>
          ) : (
            <View key={index} style={styles.fieldContainer}>
              {field.icon && <Ionicons name={field.icon} size={18} color="#333333" style={styles.fieldIcon} />}
              <Text style={styles.fieldText}>{field.label}: {item[field.key] || 'N/A'}</Text>
            </View>
          )
        ))}
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>{item.price || 'N/A'}</Text>
          <View
            style={[
              styles.warrantyBadge,
              {
                backgroundColor:
                  warranty === 'Warranty' ? '#E6F4EA' : warranty === 'Unknown' ? '#E0E0E0' : '#FEE2E2',
              },
            ]}
          >
            <Text
              style={[
                styles.warrantyText,
                {
                  color:
                    warranty === 'Warranty' ? '#16A34A' : warranty === 'Unknown' ? '#666666' : '#DC2626',
                },
              ]}
            >
              {warranty}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

// Reusable Empty List Component (from Purchase.js)
const EmptyList = ({ searchQuery, error }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>
      {searchQuery ? 'No items match your search.' : error || 'No items in inventory.'}
    </Text>
  </View>
);

// Reusable Footer Loader Component (from Purchase.js)
const FooterLoader = ({ isLoading }) => (
  isLoading && (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="large" color="#564DCC" />
    </View>
  )
);

// InventoryScreen Component
const InventoryScreen = () => {
  const nav = useNavigation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [isServiceNameLoading, setIsServiceNameLoading] = useState(true);
  const [errorServiceName, setErrorServiceName] = useState(null);
  const [isLoadingImages, setIsLoadingImages] = useState({});

  // Fetch ServiceName from SecureStore
  useEffect(() => {
    const fetchServiceName = async () => {
      setIsServiceNameLoading(true);
      try {
        const storedServiceName = await SecureStore.getItemAsync('serviceName');
        setServiceName(storedServiceName || 'Mobile');
      } catch (error) {
        console.error('Failed to fetch ServiceName:', error);
        setErrorServiceName('Failed to retrieve inventory type.');
        setServiceName('Mobile');
      } finally {
        setIsServiceNameLoading(false);
      }
    };
    fetchServiceName();
  }, []);

  // Get service config or fallback to Mobile
  const serviceConfig = servicesConfig[serviceName] || servicesConfig.Mobile;

  // Use the service's fetch hook
  const { items, isLoading, isInitialLoading, error, loadMore, refresh } = serviceConfig.hook();

  // Filter data based on search query
  const filteredData = useMemo(
    () =>
      Array.isArray(items)
        ? items.filter((item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [],
    [items, searchQuery]
  );

  // Handle navigation to AddEntry
  const handleAdd = useCallback(() => {
    router.push('/AddEntry');
  }, [router]);

  if (isServiceNameLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#564DCC" />
          <Text style={styles.loadingText}>Loading inventory type...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onMenuPress={() => nav.openDrawer()} onAddPress={handleAdd} />
      <TitleSection title={serviceConfig.title} subtitle={serviceConfig.subtitle} />
      <CustomSearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={`Search ${serviceConfig.title.toLowerCase()}...`}
        accessibilityLabel={`Search ${serviceName.toLowerCase()} items`}
      />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <InventoryItem
            item={item}
            serviceConfig={serviceConfig}
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
        ListEmptyComponent={() => <EmptyList searchQuery={searchQuery} error={error || errorServiceName} />}
        ListFooterComponent={() => <FooterLoader isLoading={isLoading} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isInitialLoading}
        onRefresh={refresh}
      />
    </SafeAreaView>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    color: '#333333',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    fontWeight: '700',
    color: '#564DCC',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  list: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#EEEEEE',
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
    color: '#333333',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666666',
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
    color: '#333333',
  },
  fieldText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});