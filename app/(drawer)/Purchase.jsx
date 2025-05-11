import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Purchase = () => {
  // Sample data for the list
  const purchaseData = [
    { id: '1', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'IN WARRANTY' },
    { id: '2', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'OUT OF WARRANTY' },
    { id: '3', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'IN WARRANTY' },
    { id: '4', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'OUT OF WARRANTY' },
    { id: '5', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'OUT OF WARRANTY' },
    { id: '6', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'IN WARRANTY' },
    { id: '7', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'OUT OF WARRANTY' },
    { id: '8', name: 'iPhone 13 pro max', description: 'Phone is all okay no issue battery 100%', price: '₹54677', warranty: 'OUT OF WARRANTY' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: 'https://placeimg.com/108/104/tech' }}
        style={styles.itemImage}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>{item.price}</Text>
          <View style={[
            styles.warrantyBadge,
            { backgroundColor: item.warranty === 'IN WARRANTY' ? '#d1fae5' : '#fee2e2' }
          ]}>
            <Text style={[
              styles.warrantyText,
              { color: item.warranty === 'IN WARRANTY' ? '#16a34a' : '#dc2626' }
            ]}>
              {item.warranty}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
        />
      </View>

      {/* Search Bar */}
     

      {/* Subheader */}
      <View style={styles.subheader}>
        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>Purchased Stock</Text>
          <View style={styles.stockBadge}>
            <Text style={styles.stockNumber}>25</Text>
          </View>
        </View>
        {/* <Picker
          style={styles.dropdown}
          selectedValue="Last 30 days"
        >
          <Picker.Item label="Last 30 days" value="30" />
          <Picker.Item label="Last 10 days" value="10" />
          <Picker.Item label="Last 7 days" value="7" />
        </Picker> */}
      </View>

      {/* List of Purchased Items */}
      <FlatList
        data={purchaseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

export default Purchase;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    
  },
  

  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
   top:-30,
  width: '100%',
   zIndex:100,
    position:"absolute",
   
    
    
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
   
    
  
    fontSize: 16,
    color: '#333',
    elevation: 2,
    
  },
  subheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop:40,
    position:"relative",
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position:"relative",
    marginBottom:30,
    
   
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  stockBadge: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stockNumber: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
  },
  dropdown: {
    width: 120,
    height: 40,
  },
  list: {
    // flex: 1,
    paddingHorizontal: 20,
    
  
  
    position:"relative",
   
   

  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
   
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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