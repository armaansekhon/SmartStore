import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation, useRouter } from 'expo-router';
import useFetchSales from '../../hooks/useFetchSales';

const Sale = () => {
  const Nav = useNavigation();
  const Router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState(null); // null for "All"
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { sales, isLoading, isInitialLoading, error, loadMore, refresh } = useFetchSales(selectedDays);
  const [isLoadingImages, setIsLoadingImages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dropdown options
  const dropdownOptions = [
    { label: 'All', value: null },
    { label: 'This Week', value: 7 },
    { label: 'This Month', value: 30 },
  ];

  const statusToWarranty = (productStatus) => {
    switch (parseInt(productStatus)) {
      case 0: return 'Warranty';
      case 1: return 'Out of Warranty';
      case 2: return 'Damaged';
      case 3: return 'Lost';
      case 4: return 'Stolen';
      default: return 'Unknown';
    }
  };

  const filteredData = Array.isArray(sales)
    ? sales.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderItem = useCallback(({ item }) => {
    const batteryHealthValue = parseInt(item.batteryHealth) || 0;
    const warranty = statusToWarranty(item.productStatus) || 'Unknown';

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedProduct(item);
          setModalVisible(true);
        }}
        accessible
        accessibilityLabel={`${item.name}, ₹${item.price}, ${warranty}`}
        accessibilityRole="button"
      >
        {isLoadingImages[item.id] && (
          <ActivityIndicator size="small" color="#564dcc" style={styles.imageLoader} />
        )}
        <Image
          source={{ uri: item.image || 'https://placeimg.com/108/104/tech' }}
          style={[styles.itemImage, isLoadingImages[item.id] && { opacity: 0.5 }]}
          defaultSource={require('../../assets/images/icon.png')}
          onLoadStart={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: true }))}
          onLoadEnd={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: false }))}
          onError={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: false }))}
        />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.batteryContainer}>
            <Ionicons
              name={batteryHealthValue >= 90 ? 'battery-full' : batteryHealthValue >= 80 ? 'battery-half' : 'battery-dead'}
              size={18}
              color={batteryHealthValue >= 90 ? '#34d399' : batteryHealthValue >= 80 ? '#facc15' : '#f87171'}
              style={styles.batteryIcon}
            />
            <Text style={styles.batteryText}>Battery Health: {item.batteryHealth}%</Text>
          </View>
          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>₹{item.price}</Text>
            <View style={[
              styles.warrantyBadge,
              {
                backgroundColor:
                  warranty === 'Warranty' ? '#1a3c34' :
                  warranty === 'Unknown' ? '#3a3a3a' : '#4b1c1c'
              }
            ]}>
              <Text style={[
                styles.warrantyText,
                {
                  color:
                    warranty === 'Warranty' ? '#34d399' :
                    warranty === 'Unknown' ? '#aaa' : '#f87171'
                }
              ]}>
                {warranty}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [isLoadingImages]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No items match your search.' : error || 'No sale items available.'}
      </Text>
    </View>
  );

  const renderFooter = () => (
    isLoading && (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#564dcc" />
      </View>
    )
  );

  const renderModal = () => {
    if (!selectedProduct) return null;

    const warranty = statusToWarranty(selectedProduct.productStatus) || 'Unknown';
    const images = selectedProduct.images || [];

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  accessibilityLabel="Close product details"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {images.length > 0 && (
                <FlatList
                  horizontal
                  data={images}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item.uri || 'https://placeimg.com/300/200/tech' }}
                      style={styles.modalImage}
                      onError={() => console.warn(`Failed to load image: ${item.uri}`)}
                    />
                  )}
                  keyExtractor={(item, index) => `${index}`}
                  style={styles.imageCarousel}
                  showsHorizontalScrollIndicator={false}
                />
              )}

              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>Description</Text>
                <Text style={styles.modalText}>{selectedProduct.description || 'No description available'}</Text>

                <Text style={styles.modalLabel}>Price</Text>
                <Text style={styles.modalText}>₹{selectedProduct.price}</Text>

                <Text style={styles.modalLabel}>Battery Health</Text>
                <View style={styles.batteryContainer}>
                  <Ionicons
                    name={parseInt(selectedProduct.batteryHealth) >= 90 ? 'battery-full' : parseInt(selectedProduct.batteryHealth) >= 80 ? 'battery-half' : 'battery-dead'}
                    size={18}
                    color={parseInt(selectedProduct.batteryHealth) >= 90 ? '#34d399' : parseInt(selectedProduct.batteryHealth) >= 80 ? '#facc15' : '#f87171'}
                    style={styles.batteryIcon}
                  />
                  <Text style={styles.modalText}>{selectedProduct.batteryHealth}%</Text>
                </View>

                <Text style={styles.modalLabel}>Product Status</Text>
                <Text style={[styles.modalText, { color: warranty === 'Warranty' ? '#34d399' : warranty === 'Unknown' ? '#aaa' : '#f87171' }]}>
                  {warranty}
                </Text>

                {selectedProduct.serialNumber && (
                  <>
                    <Text style={styles.modalLabel}>Serial Number</Text>
                    <Text style={styles.modalText}>{selectedProduct.serialNumber}</Text>
                  </>
                )}

                {(selectedProduct.imeiNumber1 || selectedProduct.imeiNumber2) && (
                  <>
                    <Text style={styles.modalLabel}>IMEI Number(s)</Text>
                    {selectedProduct.imeiNumber1 && <Text style={styles.modalText}>IMEI 1: {selectedProduct.imeiNumber1}</Text>}
                    {selectedProduct.imeiNumber2 && <Text style={styles.modalText}>IMEI 2: {selectedProduct.imeiNumber2}</Text>}
                  </>
                )}

                <Text style={styles.modalLabel}>Customer Details</Text>
                <Text style={styles.modalText}>Name: {selectedProduct.customerName || 'N/A'}</Text>
                <Text style={styles.modalText}>Phone: {selectedProduct.phone || 'N/A'}</Text>
                <Text style={styles.modalText}>Village: {selectedProduct.address || 'N/A'}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Render dropdown modal
  const renderDropdownModal = () => (
    <Modal
      visible={dropdownVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setDropdownVisible(false)}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setDropdownVisible(false)}
      >
        <View style={styles.dropdownModal}>
          {dropdownOptions.map((option) => (
            <TouchableOpacity
              key={option.value === null ? 'null' : option.value}
              style={[
                styles.dropdownOption,
                selectedDays === option.value && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                console.log('Selected option:', option.value);
                setSelectedDays(option.value);
                setDropdownVisible(false);
                refresh();
              }}
              accessibilityLabel={`Filter by ${option.label}`}
              accessibilityRole="button"
            >
              <Text style={styles.dropdownOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Open menu" onPress={() => Nav.openDrawer()} accessibilityRole="button">
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Add new item" accessibilityRole="button">
          <Ionicons name="add" size={28} onPress={() => Router.push('/AddEntry')} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title and Animation */}
      <View style={styles.titleContainer}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Sales</Text>
          <Text style={styles.subtitleText}>Here is the list of items for sale</Text>
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

      {/* Search and Dropdown Row */}
      <View style={styles.inputRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#564dcc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items for sale..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search sale items"
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(true)}
          accessibilityLabel="Select sale time range"
          accessibilityRole="button"
        >
          <Text style={styles.dropdownButtonText}>
            {dropdownOptions.find(opt => opt.value === selectedDays)?.label || 'All'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#564dcc" />
        </TouchableOpacity>
      </View>

      {/* List of Sale Items */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isInitialLoading}
        onRefresh={refresh}
      />

      {renderModal()}
      {renderDropdownModal()}
    </SafeAreaView>
  );
};

export default Sale;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#564dcc',
  },
  subtitleText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 6,
  },
  animationContainer: {
    width: 100,
    height: 100,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.3 }],
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
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
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
    color: '#fff',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#564dcc',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 160,
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    width: 160,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownOptionSelected: {
    backgroundColor: '#564dcc',
  },
  dropdownOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#333',
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
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 6,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 6,
    borderRadius: 6,
  },
  batteryIcon: {
    marginRight: 6,
  },
  batteryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#aaa',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#564dcc',
    marginTop: 12,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
  },
  modalImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#333',
  },
  imageCarousel: {
    marginBottom: 20,
  },
});