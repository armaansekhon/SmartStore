import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Platform, ImageBackground, TextInput, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import Statsection from '../../components/ui/Statsection';
import useGetUserData from '../../hooks/useGetUserData';
import useGetProductStats from '../../hooks/useGetProductStats';
import { RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';

const Index = () => {
  const drawer = useRef(null);
  const router = useRouter();
  const navigation = useNavigation();
  const { data, isLoading: userLoading, error: userError, refetch: refetchUser } = useGetUserData();
  const { isLoading: statsLoading, refetch: refetchStats } = useGetProductStats();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');

  const user = data && data[0] ? data[0] : null;
  const business = user && user.bussinessDetail && user.bussinessDetail.length > 0 ? user.bussinessDetail[0] : null;

  const handleRefresh = useCallback(async () => {
    console.log('Index pull-to-refresh triggered at:', new Date().toISOString());
    setRefreshing(true);
    try {
      await Promise.all([refetchUser(), refetchStats()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, refetchStats]);

  const serviceBadges = user?.serviceName ? user.serviceName.split('/') : [];

  const dropdownOptions = [
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  // Dynamic Lottie and ImageBackground based on serviceName
  const getServiceAssets = (serviceName) => {
    const service = serviceName?.toLowerCase() || '';
    if (service.includes('mobile') || service.includes('laptop')) {
      return {
        lottie: require('../../assets/lottie/mobile.json'),
        image: require('../../assets/images/mobile.jpg'),
      };
    } else if (service.includes('vehicle')) {
      return {
        lottie: require('../../assets/lottie/vehicle.json'),
        image: require('../../assets/images/vehicles.png'),
      };
    }
    // Default fallback assets
    return {
      lottie: require('../../assets/lottie/vehicle.json'),
      image: require('../../assets/images/vehicles.png'),
    };
  };

  const { lottie, image } = user?.serviceName ? getServiceAssets(user.serviceName) : {
    lottie: require('../../assets/lottie/vehicle.json'),
    image: require('../../assets/images/vehicles.png'),
  };

  console.log('Index rendered, userLoading:', userLoading, 'statsLoading:', statsLoading, 'user:', user, 'refreshing:', refreshing);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Notification')}>
            <View style={styles.notificationIcon}>
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../assets/images/bell.png")}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* User Section */}
        {userLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#564dcc" />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        )}

        {userError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{userError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
              accessibilityLabel="Retry loading dashboard"
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!userLoading && !userError && user && (
          <>
            <View style={styles.userSection}>
              <Ionicons name="person-circle" size={60} color="#000" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.greeting}>
                  Hello,{' '}
                  <Text style={{ color: '#5aaf57' }}>
                    {(user.firstName || '').trim()}
                  </Text>
                </Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
            </View>

            {/* Dashboard */}
            <ScrollView
              style={styles.content}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing || userLoading || statsLoading}
                  onRefresh={handleRefresh}
                  colors={['#564dcc']}
                  tintColor="#564dcc"
                  progressViewOffset={Platform.OS === 'android' ? 20 : 0}
                  android_ripple={{ color: '#564dcc', borderless: true }}
                  nestedScrollEnabled={true}
                />
              }
            >
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerLine} />
              </View>

              {/* Business Detail Card */}
              {business && (
                <ImageBackground
                  source={image}
                  style={styles.businessCard}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.overlay} />
                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Text style={styles.businessTitle}>{business.name}</Text>
                      <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color="#93c5fd" />
                        <Text style={styles.infoText}>
                          {`${business.address1}, ${business.state}, ${business.country}`}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="pricetag-outline" size={20} color="#6ee7b7" />
                        <Text style={styles.infoText}>{user.serviceName}</Text>
                      </View>
                      <View style={styles.badgesContainer}>
                        {serviceBadges.map((badge, index) => (
                          <View
                            key={index}
                            style={[
                              styles.badge,
                              { backgroundColor: index % 2 === 0 ? '#3b82f6' : '#10b981' },
                            ]}
                            accessibilityLabel={`Service badge: ${badge.trim()}`}
                          >
                            <Text style={styles.badgeText}>{badge.trim()}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setDropdownVisible(true)}
                      accessibilityLabel="Select time period"
                    >
                      <Text style={styles.dropdownText}>{selectedPeriod}</Text>
                      <Ionicons name="chevron-down" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              )}

              {/* Instruction Text and Lottie Animation */}
              <View style={styles.instructionContainer}>
                <View style={styles.instructionTextContainer}>
                  <Text style={styles.instructionText}>Select the dropdown to view</Text>
                  <Text style={styles.instructionText}>business stats</Text>
                </View>
                <LottieView
                  source={lottie}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </View>

              <View style={styles.cardsContainer}>
                <Statsection serviceName={user.serviceName} />
              </View>
            </ScrollView>
          </>
        )}

        {/* Dropdown Modal */}
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.dropdownModal}>
              {dropdownOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.dropdownOption,
                    selectedPeriod === option.label && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedPeriod(option.label);
                    setDropdownVisible(false);
                  }}
                  accessibilityLabel={`Select ${option.label}`}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    bottom: 0,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20,
    marginVertical: 0,
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'PlusSB',
  },
  content: {
    flex: 1,
    bottom: 25,
    paddingHorizontal: 10,
  },
  cardsContainer: {
    borderRadius: 16,
    padding: 0,
    marginBottom: 20,
  },
  businessCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  businessTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'PlusSB',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    color: '#d1d5db',
    marginLeft: 8,
    fontSize: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
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
  notificationIcon: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 100,
    shadowColor: 'gray',
    shadowOpacity: 0.4,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 2 },
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 0.2,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fafafa',
  },
  searchIcon: {
    marginRight: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 160,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  dropdownOptionText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  instructionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  instructionTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  instructionText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  lottieAnimation: {
    width: 100,
    height: 100,
    transform: [{ scale: 1}],
  },
});

export default Index;