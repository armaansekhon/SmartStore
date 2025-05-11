import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const Index = () => {

  const Router=useRouter
  return (
    
    <View style={styles.safeArea}>
      {/* Card positioned above the header */}
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

      {/* Main content */}

        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Overview</Text>
            {/* <Picker
              style={styles.dropdown}
              selectedValue="Last 30 Days"
            >
              <Picker.Item label="Last 30 Days" value="30" />
              <Picker.Item label="Last 10 Days" value="10" />
              <Picker.Item label="Last 7 Days" value="7" />
            </Picker> */}
          </View>

          {/* Boxes Section */}
          <View style={styles.boxesContainer}>
            {/* First Row: Purchase and Sale */}
            <View style={styles.row}>
              {/* Purchase Box */}
              <View style={styles.box}>
                <Text style={[styles.boxLabel, {color:"white" ,backgroundColor: '#006600' }]}>Purchase</Text>
                <Text style={styles.boxNumber}>450</Text>
              </View>

              {/* Sale Box */}
              <View style={styles.box}>
                <Text style={[styles.boxLabel, {color:"white",width:"40%", backgroundColor:"#9d0000" }]}>Sale</Text>
                <Text style={styles.boxNumber}>50</Text>
              </View>
            </View>

            {/* Second Row: Inventory */}
            <View style={styles.row}>
              {/* Inventory Box */}
              <View style={[styles.box, styles.fullWidthBox]}>
                <Text style={[styles.boxLabel, { color:"white", backgroundColor: '#3367B1' }]}>Inventory</Text>
                <Text style={styles.boxNumber}>400</Text>
              </View>
            </View>
          </View>

          {/* Add Entry Button */}
          <TouchableOpacity
                   style={{ width:'100%' , alignSelf:"center"}}
                   
                 >
                   <LinearGradient
                     colors={['#3367B1', '#9285BF']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 0 }}
                     style={styles.button}
                   >
                     <Text style={styles.buttonText}>Add Entry</Text>
                   </LinearGradient>
                 </TouchableOpacity>
        </View>
    
    </View>
 
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex:1,
    backgroundColor:"#fff"
    
    
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
  content: {
    marginTop: 70, // Adjusted to start content below the card (100 card height + some padding)
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdown: {
    width: 150,
    height: 40,
  },
  boxesContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    padding: 15,
    width: '48%',
    height: 150,
    justifyContent: 'center',
    position: 'relative',
  },
  fullWidthBox: {
    width: '50%',
  },
  boxLabel: {
    fontSize: 16,
    padding:8,
    width:"70%",
    borderRadius:4,
    fontWeight: '600',
    position: 'absolute',
   textAlign:"center",

    top: 10,
    left: 10,
  },
  boxNumber: {
    fontSize: 36,
    fontWeight: 500,
    color: '#333',
    textAlign: 'left',
    top:10,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    bottom:70,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
   
    fontWeight: '600',
  },
});