import React, { useState, Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PurchaseForm from '../../components/ui/PurchaseForm';
import SaleForm from '../../components/ui/SaleForm';
import { Alert } from 'react-native';
import { useNavigation } from 'expo-router';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false })}
            accessibilityLabel="Retry"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const AddEntry = () => {
  const Nav =useNavigation()
  const [activeTab, setActiveTab] = useState('purchase');

  const handleSave = () => {
    Alert.alert('Success', 'Form data saved (check console for details).');
  };

  const handleCancel = () => {
    Alert.alert('Cancelled', 'Form has been reset.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ErrorBoundary>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="Open menu" accessibilityRole="button">
            <Ionicons name="menu"  size={28} color="#fff"  
            onPress={()=>{Nav.openDrawer()}}
            
            />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Back" accessibilityRole="button">
            <Ionicons name="arrow-back" size={28} 
              onPress={()=>{Nav.goBack()}}
            color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Add New Order</Text>
          <Text style={styles.subtitleText}>Create a new purchase or sale order</Text>
        </View>

        {/* Tab Toggle */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'purchase' && styles.activeTab]}
            onPress={() => setActiveTab('purchase')}
            accessibilityLabel="Purchase tab"
            accessibilityRole="button"
          >
            <Text style={[styles.tabText, activeTab === 'purchase' && styles.activeTabText]}>Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sale' && styles.activeTab]}
            onPress={() => setActiveTab('sale')}
            accessibilityLabel="Sale tab"
            accessibilityRole="button"
          >
            <Text style={[styles.tabText, activeTab === 'sale' && styles.activeTabText]}>Sale</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        {activeTab === 'purchase' ? (
          <PurchaseForm onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <SaleForm onSave={handleSave} onCancel={handleCancel} />
        )}
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export default AddEntry;

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
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#564dcc',
  },
  tabText: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#564dcc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});