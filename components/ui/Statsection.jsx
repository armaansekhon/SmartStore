import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import StatCard from './StatCard';
import useGetProductStats from '../../hooks/useGetProductStats';

const Statsection = ({ serviceName }) => {
  const { data, isLoading, error, refetch } = useGetProductStats();

  const handleRetry = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      {isLoading && (
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
          <View style={styles.cardWrapper}>
            <StatCard
              title="Purchases"
              value={data.totalPurchaseCount.toString()}
           percentage={`₹${Number(data.totalPurchaseValue).toLocaleString('en-IN')}`}// Placeholder; no percentage in API
              iconName="home"
              gradientColors={['#32D07D', '#0DAF69']}
             
            />
          </View>

          <View style={styles.cardWrapper}>
            <StatCard
              title="Sales"
              value={data.totalSaleCount.toString()}
              percentage={`₹${Number(data.totalSaleValue).toLocaleString('en-IN')}`}
              iconName="people-outline"
              gradientColors={['#1182ff', '#61ADff']}
          
            />
          </View>

          <View style={styles.cardWrapper}>
            <StatCard
              title="Stock"
              value={data.totalInventoryCount.toString()}
              percentage={`₹${Number(data.totalInventoryValue).toLocaleString('en-IN')}`}
              iconName="hand-left"
              gradientColors={['#1182ff', '#61ADff']}
          
            />
          </View>
          <View style={styles.cardWrapper}>
        <StatCard
          title="Leads"
          value="$695"
          percentage="+15.03%"
          iconName="trending-up"
          gradientColors={['#F4A500', '#FEC301']}
        />
      </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 18,
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