import React, { useState, useCallback, Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList , TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

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

// Utility to format relative time
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const diffMs = now - new Date(timestamp);
  const diffMin = Math.floor(diffMs / 1000 / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return 'Yesterday';
};

const Notification = () => {
  const router=useRouter()
  // Sample notification data
  const [notificationData] = useState([
    { id: '1', message: 'iPhone 13 Pro Max purchased successfully', status: 'success', timestamp: new Date(Date.now() - 8 * 60 * 1000), date: 'Today' },
    { id: '2', message: 'iPhone 13 Pro Max purchase failed', status: 'failure', timestamp: new Date(Date.now() - 13 * 60 * 1000), date: 'Today' },
    { id: '3', message: 'iPhone 14 added to inventory', status: 'success', timestamp: new Date(Date.now() - 25 * 60 * 1000), date: 'Today' },
    { id: '4', message: 'iPhone 12 Pro sold successfully', status: 'success', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), date: 'Yesterday' },
    { id: '5', message: 'Payment for iPhone 11 failed', status: 'failure', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), date: 'Yesterday' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState({});

  // Filter notifications based on search query
  const filteredData = notificationData.filter(item =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = useCallback(({ item }) => {
    if (!item || !item.message) return null; // Guard against invalid data
    const isNewDate = filteredData.indexOf(item) === 0 || item.date !== filteredData[filteredData.indexOf(item) - 1]?.date;
    return (
      <View>
        {isNewDate && <Text style={styles.dateHeader}>{item.date}</Text>}
        <View
          style={[
            styles.notification,
            item.status === 'success' ? styles.successNotification : styles.failureNotification,
          ]}
          accessible
          accessibilityLabel={`${item.message}, ${formatRelativeTime(item.timestamp)}`}
        >
          <Text
            style={item.status === 'success' ? styles.successIcon : styles.failureIcon}
          >
            {item.status === 'success' ? '✓' : '✗'}
          </Text>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationText}>{item.message}</Text>
            <Text
              style={item.status === 'success' ? styles.notificationTime : styles.notificationTimeFailed}
            >
              {formatRelativeTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  }, []);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No notifications match your search.' : 'No notifications available.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ErrorBoundary>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="Open menu" accessibilityRole="button">
            <Ionicons name="chevron-back" size={28} onPress={()=>{router.back()}} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Clear notifications" accessibilityRole="button">
            <Ionicons name="trash-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
      

        {/* Title and Animation */}
        <View style={styles.titleContainer}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleText}>Notifications</Text>
            <Text style={styles.subtitleText}>Your recent activity updates</Text>
          </View>
          <View style={styles.animationContainer}>
            {/*
              Note: Ensure '../../assets/lottie/reales2.json' exists in your project.
              If not, replace with a valid Lottie file or remove the LottieView.
            */}
            {require('../../assets/lottie/reales2.json') ? (
              <LottieView
                source={require('../../assets/lottie/reales2.json')}
                autoPlay
                loop
                style={styles.lottieAnimation}
                onError={() => console.warn('Lottie animation failed to load')}
              />
            ) : (
              <View style={styles.lottieFallback}>
                <Text style={styles.lottieFallbackText}>Animation unavailable</Text>
              </View>
            )}
          </View>
        </View>

        {/* Search Bar */}
       
        {/* Notification List */}
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || `fallback-${Math.random()}`}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={21}
          ListEmptyComponent={renderEmptyComponent}
        />
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export default Notification;

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
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: '#333',
  },
  imageLoader: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 1,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#aaa',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  titleTextContainer: {
    flex: 1,
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
  animationContainer: {
    width: 100,
    height: 100,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  lottieFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  lottieFallbackText: {
    color: '#aaa',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  list: {
    paddingHorizontal: 20,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 10,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.210,
    shadowRadius: 4,
  },
  successNotification: {
    borderLeftWidth: 7,
    borderLeftColor: '#16a34a', // Green for success
  },
  failureNotification: {
    borderLeftWidth: 7,
    borderLeftColor: '#dc2626', // Red for failure
  },
  successIcon: {
    fontSize: 20,
    backgroundColor: '#16a34a',
    color: '#fff',
    marginRight: 10,
    borderRadius: 80,
    padding: 5,
  },
  failureIcon: {
    fontSize: 20,
    backgroundColor: '#dc2626',
    color: '#fff',
    borderRadius: 80,
    padding: 5,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#fff',
  },
  notificationTime: {
    fontSize: 12,
    color: '#aaa',
  },
  notificationTimeFailed: {
    fontSize: 12,
    color: '#aaa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
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