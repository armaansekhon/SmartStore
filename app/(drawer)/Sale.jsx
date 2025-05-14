import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';

const Sale = () => {
  // Sample data for the list
  const Nav= useNavigation()
  const [saleData, setSaleData] = useState([
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

  // Filter data based on search query
  const filteredData = saleData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: 'https://placeimg.com/108/104/tech' }}
        style={styles.itemImage}
        defaultSource={require('../../assets/images/icon.png')} // Fallback image
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.batteryContainer}>
          <Ionicons name="battery-full" size={16} color="#34d399" style={styles.batteryIcon} />
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={()=>{Nav.openDrawer()}}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title and Animation */}
      <View style={styles.titleContainer}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Sale</Text>
          <Text style={styles.subtitleText}>Here is the list of items for sale</Text>
        </View>
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/lottie/reales2.json')} // Ensure you have a Lottie JSON file
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#564dcc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items for sale..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List of Sale Items */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginTop: 4,
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
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
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#333', // Fallback background for image loading
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  batteryIcon: {
    marginRight: 4,
  },
  batteryText: {
    fontSize: 14,
    color: '#aaa',
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
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  warrantyText: {
    fontSize: 12,
    fontWeight: '600',
  },
});