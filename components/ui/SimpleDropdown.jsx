import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const SimpleDropdown = ({ selectedValue, onChange, data: options, placeholder = 'Select Category' }) => {
  const [open, setOpen] = useState(false);

  // Map options to { label, value } and validate
  const items = Array.isArray(options)
    ? options.map((item) => ({
        label: item.label || 'Unknown',
        value: item.value || '',
      }))
    : [];

  const handleChange = (value) => {
    console.log('Dropdown Selected Value:', value);
    onChange(value);
  };

  return (
    <View style={styles.container}>
      {items.length > 0 ? (
        <DropDownPicker
          open={open}
          value={selectedValue}
          items={items}
          setOpen={setOpen}
          setValue={handleChange}
          placeholder={placeholder}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
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
  );
};

export default SimpleDropdown;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: '100%',
    zIndex: 1000,
  },
  dropdown: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownContainer: {
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