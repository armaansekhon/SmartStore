import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import PurchaseForm from '../../components/ui/PurchaseForm';
import SaleForm from '../../components/ui/SaleForm';
import PurVehicleForm from '../../components/ui/PurVehicleForm';
import SaleVehicleForm from '../../components/ui/SaleVehicleForm';
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
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('purchase');
  const [serviceName, setServiceName] = useState(null);

  useEffect(() => {
    const fetchServiceName = async () => {
      try {
        const storedServiceName = await SecureStore.getItemAsync('serviceName');
        console.log(storedServiceName,"service is hereeeeeeee")
        setServiceName(storedServiceName);
      } catch (err) {
        console.error('Failed to fetch serviceName from SecureStore:', err.message);
        Alert.alert('Error', 'Unable to load service configuration.');
      }
    };
    fetchServiceName();
  }, []);

  const handleSave = () => {
    Alert.alert('Success', 'Form data saved (check console for details).');
  };

  const handleCancel = () => {
    Alert.alert('Cancelled', 'Form has been reset.');
  };

  const renderForm = () => {
    if (!serviceName) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading service configuration...</Text>
        </View>
      );
    }

    const isVehicle = serviceName === 'Vehicle';
    const isMobileOrLaptop = serviceName === 'Mobile/Laptop' || serviceName === 'Laptop';

    if (activeTab === 'purchase') {
      return isVehicle ? (
        <PurVehicleForm onSave={handleSave} onCancel={handleCancel} />
      ) : isMobileOrLaptop ? (
        <PurchaseForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unsupported service: {serviceName}</Text>
        </View>
      );
    } else {
      return isVehicle ? (
        <SaleVehicleForm onSave={handleSave} onCancel={handleCancel} />
      ) : isMobileOrLaptop ? (
        <SaleForm onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unsupported service: {serviceName}</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ErrorBoundary>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="Open menu" accessibilityRole="button">
            <Ionicons
              name="menu"
              size={28}
              color="#000"
              onPress={() => navigation.openDrawer()}
            />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Back" accessibilityRole="button">
            <Ionicons
              name="arrow-back"
              size={28}
              color="#000"
              onPress={() => navigation.goBack()}
            />
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
        {renderForm()}
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 38,
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#000',
    marginTop: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth:1,
    borderColor:"#aaa",

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
    color: '#000',
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
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
  },
});