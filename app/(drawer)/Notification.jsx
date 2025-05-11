import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notification = () => {
  return (
    <View>
      {/* Card Content */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://placeimg.com/108/104/people' }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.main}>
          <Text style={styles.today}>Today</Text>

          {/* Notifications */}
          <View style={styles.notificationContainer}>
            {/* Success Notification */}
            <View style={[styles.notification, styles.successNotification]}>
              <Text style={styles.successIcon}>✓</Text>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationText}>iPhone 13 Pro Max purchased successfully</Text>
                <Text style={styles.notificationTime}>8 min ago</Text>
              </View>
            </View>

            {/* Failure Notification */}
            <View style={[styles.notification, styles.failureNotification]}>
              <Text style={styles.failureIcon}>✗</Text>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationText}>iPhone 13 Pro Max purchase failed</Text>
                <Text style={styles.notificationTimeFailed}>13 min ago</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  
  main: {
    marginTop: 20,
    padding: 12,
  },
  today: {
    fontSize: 20,
    fontWeight: '350',
    color: '#333',
    marginBottom: 10,
  },
  cardContainer: {
    position: 'absolute',
    top: -30, // Adjust to overlap header (header height is 190, so place card near bottom of header)
    left: '10%',
    right: '10%',
    width: '80%',
    height: 100,
    zIndex: 10, // Higher zIndex to ensure it’s above the header
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    flex: 1,
    padding: 15,
    height: '100%',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  notificationContainer: {
    marginTop: 10,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
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
    color:"#fff",
    marginRight: 10,
    borderRadius:80,
    padding :5,
    
  },
  failureIcon: {
    fontSize: 20,
    backgroundColor: '#dc2626',
    color:"#fff",
 
    borderRadius:80,
    padding :5,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  notificationTimeFailed: {
    fontSize: 12,
    color: '#666', // Slightly darker grey for failed notification
  },
});