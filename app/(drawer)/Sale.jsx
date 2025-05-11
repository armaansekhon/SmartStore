import React from 'react';
import { StyleSheet, Text, View, TextInput,  TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Sale = () => {
  return (
    <View style={styles.safeArea}>
      {/* Header (already set as per your comment) */}
      

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#888"
        />
      </View>

      {/* Subheader */}
      <View style={styles.subheader}>
        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>Sold Stock</Text>
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

      {/* Placeholder for SVG and Text */}
      <View style={styles.content}>
        {/* Placeholder for SVG (e.g., person with cart illustration) */}
        <View style={styles.svgPlaceholder}>
          <Text style={styles.placeholderText}>[SVG Placeholder: Person with Cart Illustration]</Text>
        </View>

        {/* Text */}
        <Text style={styles.noStockText}>Oops! No Stock Found</Text>
        <Text style={styles.descriptionText}>
          You can add stock by clicking button below the will reflect here.
        </Text>

        {/* Add Entry Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sale;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerIcon: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    position:"absolute",
    width:"100%",
    zIndex:10,
    top:-30,
    
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    elevation: 2,
  },
  subheader: {
    marginTop:30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  stockBadge: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stockNumber: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
  },
  dropdown: {
    width: 120,
    height: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  svgPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  noStockText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    
    borderColor: '#3b82f6',
    
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
});