import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Expo-compatible icons

const CustomCheckBox = ({ label, checked, onChange }) => (
  <Pressable onPress={() => onChange(!checked)} style={styles.checkboxContainer}>
    <Ionicons
      name={checked ? 'checkbox-outline' : 'square-outline'}
      size={24}
      color="#333"
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  checkboxLabel: {
    marginLeft: 8
  }
});

export default CustomCheckBox;
