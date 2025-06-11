import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import PurchaseForm from '../../components/ui/PurchaseForm';
import SaleForm from '../../components/ui/SaleForm';

class ErrorBoundary extends React.Component {
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

const UpdateEntry = () => {
  const Nav = useNavigation();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('purchase');
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (!accessToken) {
          throw new Error('No access token found.');
        }

        const response = await axios.get(
          `https://trackinventory-xdex.onrender.com/api/Product/GetProductById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log('Fetched product:', response.data);
        setProductData(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch product.';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSave = () => {
    Alert.alert('Success', 'Product updated successfully.');
    Nav.goBack();
  };

  const handleCancel = () => {
    Alert.alert('Cancelled', 'Changes discarded.');
    Nav.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#564dcc" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !productData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Product not found.'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => Nav.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initialData = {
    name: productData.name || '',
    description: productData.description || '',
    batteryHealth: productData.batteryHealth?.toString() || '0',
    imei1: productData.imeiNumber1 || '',
    imei2: productData.imeiNumber2 || '',
    serialNumber: productData.serialNumber || '',
    price: productData.price?.toString() || '0',
    status: productData.productStatus?.toString() || '0',
  };

  const initialSellerDetails = {
    name: productData.customerName || '',
    phone: productData.mobileNumber || '',
    village: productData.address || '',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ErrorBoundary>
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="Open menu" accessibilityRole="button">
            <Ionicons name="menu" size={28} color="#000" onPress={() => Nav.openDrawer()} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Back" accessibilityRole="button">
            <Ionicons name="arrow-back" size={28} color="#000" onPress={() => Nav.goBack()} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Update Order</Text>
          <Text style={styles.subtitleText}>Update purchase or sale order</Text>
        </View>

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

        {activeTab === 'purchase' ? (
          <PurchaseForm
            onSave={handleSave}
            onCancel={handleCancel}
            initialData={initialData}
            initialSellerDetails={initialSellerDetails}
            productId={id}
          />
        ) : (
          <SaleForm
            onSave={handleSave}
            onCancel={handleCancel}
            initialData={initialData}
            initialSellerDetails={initialSellerDetails}
            productId={id}
          />
        )}
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export default UpdateEntry;

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
    backgroundColor: '#fff',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});