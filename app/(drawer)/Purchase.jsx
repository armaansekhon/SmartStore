import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';

const Purchase = () => {
  // Sample data for the list
  const Nav = useNavigation();
  const [purchaseData] = useState([
    { id: '1', name: 'iPhone 13 Pro Max', description: 'Phone is in excellent condition', batteryHealth: '100%', price: '₹54,677', warranty: 'IN WARRANTY' },
    { id: '2', name: 'iPhone 12 Pro', description: 'Phone is in good condition', batteryHealth: '85%', price: '₹45,000', warranty: 'OUT OF WARRANTY' },
    { id: '3', name: 'iPhone 14', description: 'Like new, barely used', batteryHealth: '95%', price: '₹60,000', warranty: 'IN WARRANTY' },
    { id: '4', name: 'iPhone 11', description: 'Phone is in excellent condition', batteryHealth: '80%', price: '₹35,000', warranty: 'OUT OF WARRANTY' },
    { id: '5', name: 'iPhone 13', description: 'Minor scratches', batteryHealth: '90%', price: '₹50,000', warranty: 'OUT OF WARRANTY' },
    { id: '6', name: 'iPhone 13 Pro Max', description: 'Phone is in excellent condition', batteryHealth: '98%', price: '₹55,000', warranty: 'IN WARRANTY' },
    { id: '7', name: 'iPhone 12', description: 'Good condition', batteryHealth: '87%', price: '₹40,000', warranty: 'OUT OF WARRANTY' },
    { id: '8', name: 'iPhone 14 Pro', description: 'Excellent condition', batteryHealth: '99%', price: '₹65,000', warranty: 'IN WARRANTY' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState({});

  // Filter data based on search query
  const filteredData = purchaseData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = useCallback(({ item }) => {
    console.log(`Rendering item: ${item.name}, Battery Health: ${item.batteryHealth}`);
    const batteryHealthValue = parseInt(item.batteryHealth) || 0; // Parse to number, fallback to 0
    return (
      <View style={styles.itemContainer} accessible accessibilityLabel={`${item.name}, ${item.price}, ${item.warranty}`}>
        {isLoadingImages[item.id] && (
          <ActivityIndicator size="small" color="#564dcc" style={styles.imageLoader} />
        )}
        <Image
          source={{ uri: 'https://placeimg.com/108/104/tech' }}
          style={[styles.itemImage, isLoadingImages[item.id] && { opacity: 0.5 }]}
          defaultSource={require('../../assets/images/icon.png')}
          onLoadStart={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: true }))}
          onLoadEnd={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: false }))}
          onError={() => setIsLoadingImages(prev => ({ ...prev, [item.id]: false }))}
        />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <View style={styles.batteryContainer}>
            <Ionicons
              name={batteryHealthValue >= 90 ? 'battery-full' : batteryHealthValue >= 80 ? 'battery-half' : 'battery-dead'}
              size={18}
              color={batteryHealthValue >= 90 ? '#34d399' : batteryHealthValue >= 80 ? '#facc15' : '#f87171'}
              style={styles.batteryIcon}
            />
            <Text style={styles.batteryText}>Battery Health: {item.batteryHealth}</Text>
          </View>
          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <View style={[
              styles.warrantyBadge,
              { backgroundColor: item.warranty === 'IN WARRANTY' ? '#1a3c34' : '#4b1c1c' }
            ]}>
              <Text style={[
                styles.warrantyText,
                { color: item.warranty === 'IN WARRANTY' ? '#34d399' : '#f87171' }
              ]}>
                {item.warranty}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, [isLoadingImages]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No items match your search.' : 'No purchased items available.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Open menu" onPress={()=>{Nav.openDrawer()}} accessibilityRole="button">
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Add new item" accessibilityRole="button">
          <Ionicons name="addPAT" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title and Animation */}
      <View style={styles.titleContainer}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Purchase</Text>
          <Text style={styles.subtitleText}>Here is the list of items purchased</Text>
        </View>
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/lottie/reales2.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
            onError={console.error}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#564dcc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search purchases..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search purchased items"
          returnKeyType="search"
        />
      </View>

      {/* List of Purchased Items */}
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
      />
    </SafeAreaView>
  );
};

export default Purchase;

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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
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
    marginBottom: 6,
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
    // backgroundColor: '#3a3a3a',
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
});