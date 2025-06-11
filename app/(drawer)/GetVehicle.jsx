
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from 'expo-router';

// Hook to fetch vehicle by ID
const useGetVehicleById = (id) => {
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicle = useCallback(async () => {
    if (!id) {
      setError('No vehicle ID provided.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (!accessToken) {
        throw new Error('No access token found. Please log in.');
      }

      const response = await axios.get(
        `https://trackinventory-xdex.onrender.com/api/Vehicle/GetProductById?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Vehicle Response:', response.data);

      const data = response.data || {};
      const mappedData = {
        ...data,
        warranty: (() => {
          switch (parseInt(data.vehicleStatus)) {
            case 0: return 'Warranty';
            case 1: return 'Out of Warranty';
            case 2: return 'Damaged';
            case 3: return 'Lost';
            case 4: return 'Stolen';
            default: return 'Unknown';
          }
        })(),
        // Fallback for images if mediaUrls is not provided
        mediaUrls: data.mediaUrls || [data.mediaThumb_100 || 'https://placeimg.com/300/200/any'],
      };

      setVehicle(mappedData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch vehicle.';
      setError(errorMessage);
      setVehicle(null);
      console.error('Fetch Vehicle Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refetch = useCallback(() => {
    setVehicle(null);
    fetchVehicle();
  }, [fetchVehicle]);

  useEffect(() => {
    fetchVehicle();
  }, [id, fetchVehicle]);

  return { vehicle, isLoading, error, refetch };
};

// Image Carousel Component
const ImageCarousel = ({ images }) => {
  const renderItem = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={styles.carouselImage}
      defaultSource={require('../../assets/images/icon.png')}
      onError={() => console.warn(`Failed to load image: ${item}`)}
    />
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={images}
        renderItem={renderItem}
        sliderWidth={350}
        itemWidth={350}
        loop
        autoplay
        autoplayInterval={3000}
        activeSlideAlignment="center"
        inactiveSlideOpacity={0.7}
        inactiveSlideScale={0.9}
      />
    </View>
  );
};

// Vehicle Card Component
const VehicleCard = ({ vehicle }) => {
  const warranty = vehicle.warranty;
  const fields = [
    { key: 'model', label: 'Model', icon: 'car' },
    { key: 'tyrePercentage', label: 'Tyre Percentage', unit: '%' },
    { key: 'noOfKeys', label: 'Number of Keys', icon: 'key' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{vehicle.name || 'Unknown'}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {vehicle.description || 'No description'}
      </Text>
      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          {field.icon && <Ionicons name={field.icon} size={18} color="#333" style={styles.fieldIcon} />}
          <Text style={styles.fieldText}>
            {field.label}: {vehicle[field.key] || 'N/A'}{field.unit || ''}
          </Text>
        </View>
      ))}
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>₹{vehicle.price || 'N/A'}</Text>
        <View
          style={[
            styles.warrantyBadge,
            {
              backgroundColor:
                warranty === 'Warranty' ? '#e6f4ea' :
                warranty === 'Unknown' ? '#e0e0e0' : '#fee2e2',
            },
          ]}
        >
          <Text
            style={[
              styles.warrantyText,
              {
                color:
                  warranty === 'Warranty' ? '#16a34a' :
                  warranty === 'Unknown' ? '#666' : '#dc2626',
              },
            ]}
          >
            {warranty}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Main Screen
const VehicleDetailsScreen = () => {
  const navigation = useNavigation();
  const vehicleId = '68457feba11f7c79938564c6'; // Hardcoded for testing
  const { vehicle, isLoading, error, refetch } = useGetVehicleById(vehicleId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={refetch}
          accessibilityLabel="Refresh"
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#564dcc" />
          <Text style={styles.loadingText}>Loading vehicle...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !error && !vehicle && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No vehicle found.</Text>
        </View>
      )}

      {!isLoading && !error && vehicle && (
        <View style={styles.content}>
          <ImageCarousel images={vehicle.mediaUrls} />
          <VehicleCard vehicle={vehicle} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default VehicleDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    color: '#333',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  carouselContainer: {
    height: 220,
    marginBottom: 16,
    alignItems: 'center',
  },
  carouselImage: {
    width: 350,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldText: {
    fontSize: 14,
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  warrantyBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  warrantyText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
