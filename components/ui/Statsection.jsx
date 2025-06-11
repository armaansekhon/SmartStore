import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import StatCard from './StatCard';
import useGetProductStats from '../../hooks/useGetProductStats';
import { RefreshControl } from 'react-native';

const Statsection = ({ serviceName }) => {
  const { data, isLoading, error, refetch } = useGetProductStats();
  const [statsRefreshing, setStatsRefreshing] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleRetry = useCallback(() => {
    console.log('Retry button pressed, refetching stats at:', new Date().toISOString());
    refetch();
  }, [refetch]);

  const handleRefresh = useCallback(async () => {
    console.log('Statsection pull-to-refresh triggered at:', new Date().toISOString());
    setStatsRefreshing(true);
    try {
      await refetch();
    } finally {
      setStatsRefreshing(false);
    }
  }, [refetch]);

  console.log('Statsection rendered, isLoading:', isLoading, 'data:', data, 'statsRefreshing:', statsRefreshing);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={statsRefreshing || isLoading}
          onRefresh={handleRefresh}
          colors={['#564dcc']}
          tintColor="#564dcc"
          progressViewOffset={Platform.OS === 'android' ? 40 : 0}
          android_ripple={{ color: '#564dcc', borderless: true }}
          nestedScrollEnabled={true}
        />
      }
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        {isLoading && !statsRefreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#564dcc" />
            <Text style={styles.loadingText}>Loading statistics...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              accessibilityLabel="Retry loading statistics"
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !error && data && (
          <>
            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={() => router.push('/Purchase')}
              accessibilityLabel="Navigate to Purchases"
            >
              <StatCard
                title="Purchases"
                value={data.totalPurchaseCount.toString()}
                percentage={`₹${Number(data.totalPurchaseValue).toLocaleString('en-IN')}`}
                iconName="home"
                gradientColors={['#32D07D', '#0DAF69']}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={() => router.push('/Sale')}
              accessibilityLabel="Navigate to Sales"
            >
              <StatCard
                title="Sales"
                value={data.totalSaleCount.toString()}
                percentage={`₹${Number(data.totalSaleValue).toLocaleString('en-IN')}`}
                iconName="people-outline"
                 gradientColors={['#667eea', '#764ba2']}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={() => router.push('/Inventory')}
              accessibilityLabel="Navigate to Stock"
            >
              <StatCard
                title="Stock"
                value={data.totalInventoryCount.toString()}
                percentage={`₹${Number(data.totalInventoryValue).toLocaleString('en-IN')}`}
                iconName="hand-left"
       gradientColors={['#667eea', '#764ba2']}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={() => router.push('/AddEntry')}
              accessibilityLabel="Navigate to Leads"
            >
              <StatCard
                title="Add Entry"
                value="+"
                percentage="Press To add"
                iconName="trending-up"
                gradientColors={['#F4A500', '#FEC301']}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: '100%',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 18,
    paddingBottom: 20,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 19,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#564dcc',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Statsection;