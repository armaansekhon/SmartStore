import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, DrawerLayoutAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Statsection from '../../components/ui/Statsection';
import LottieView from "lottie-react-native"
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';

const Index = () => {
  const drawer = useRef(null);
  const router = useRouter();
  const Nav=useNavigation();

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };


  return (
  
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => Nav.openDrawer()}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => router.push("/Notification")}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Section */}
        <View style={styles.userSection}>
          <Ionicons name="person-circle" size={60} color="#564dcc" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greeting}>Hello,<Text style={{color:"white"}} >{user.name}</Text> </Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        {/* Dashboard */}
        <ScrollView style={styles.content}>
        <View style={styles.dividerContainer}>
  <View style={styles.dividerLine} />
  {/* <Text style={styles.dividerText}>Dashboard</Text> */}
  <View style={styles.dividerLine} />

  {/* Business Detail Card */}


</View>
<View style={styles.businessCard}>
  <View style={{ flex: 1 }}>
    <Text style={styles.businessTitle}>Tech Universe</Text>

    <View style={styles.infoRow}>
      <Ionicons name="location-outline" size={20} color="#FF6B6B" />
      <Text style={styles.infoText}>USA, California, Silicon Valley</Text>
    </View>

    <View style={styles.infoRow}>
      <Ionicons name="pricetag-outline" size={20} color="#4ECDC4" />
      <Text style={styles.infoText}>Mobile, Laptop</Text>
    </View>

    <View style={styles.badgesContainer}>
      <View style={[styles.badge, { backgroundColor: '#FF6B6B' }]}>
        <Text style={styles.badgeText}>Mobile</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: '#4ECDC4' }]}>
        <Text style={styles.badgeText}>Laptop</Text>
      </View>
    </View>
  </View>

  {/* Lottie Animation */}
  <View style={styles.animationContainer}>
    <LottieView
      source={require('../../assets/lottie/reales2.json')}
      autoPlay
      loop
      style={{ width: 100, height: 100 }}
    />
  </View>
</View>



          <View style={styles.cardsContainer}>
           
<Statsection></Statsection>

          </View>

          {/* Add Entry Button */}
          <TouchableOpacity style={styles.button}>
         
              <Text style={styles.buttonText}>Add Entry</Text>
       
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
  )
   
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
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
  bottom:30,
},
dividerLine: {
  flex: 1,
  height: 1,
  backgroundColor: '#333',
},
dividerText: {
  marginHorizontal: 10,
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily:"PlusSB"
},

  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom:20,
    marginVertical: 20,
    paddingHorizontal: 16,
  
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#564dcc',
  },
  email: {
    fontSize: 14,
    color: '#bbb',
    fontFamily:"PlusSB"
  },
  content: {
    flex: 1,
    bottom:35,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily:"PlusSB"
  },
  cardsContainer: {
 // lighter black box
  borderRadius: 16,
  padding: 0,
  marginBottom: 20,
  },
  card: {
   
    borderRadius: 12,
    padding: 16,
    width: '47%',
    marginBottom: 20,
    position: 'relative',
  },
  fullWidthCard: {
    width: '100%',
  },
  cardLabelContainer: {
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 36,
    color: '#fff',
    marginTop: 20,
    fontWeight: '700',
  },
  button: {
    marginTop: 'auto',
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor:"#564dcc",
    alignItems: 'center',
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 16,
  },
  drawerTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  drawerItem: {
    marginVertical: 10,
  },
  drawerText: {
    color: '#ccc',
    fontSize: 16,
  },
  businessCard: {
  flexDirection: 'row',
  backgroundColor: '#000',
  borderRadius: 16,
  padding: 16,
  marginBottom: 20,
  alignItems: 'center',
  shadowColor: '#564dcc',
  shadowOpacity: 0.6,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
},
businessTitle: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  fontFamily: "PlusSB"
},
infoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 4,
},
infoText: {
  color: '#bbb',
  marginLeft: 8,
  fontSize: 14,
},
badgesContainer: {
  flexDirection: 'row',
  marginTop: 10,
},
badge: {
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 4,
  marginRight: 8,
},
badgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
animationContainer: {
  marginLeft: 16,
  alignItems: 'center',
  justifyContent: 'center',
},

});
