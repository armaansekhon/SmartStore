import React, { useState } from 'react';
import { StyleSheet, Text, Keyboard, View, TouchableWithoutFeedback, TextInput, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import MultiSelectComponent from '../../components/ui/MultiselectComponent'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const Bdetails = () => {
  const Router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      Router.replace("/login");
    }, 3000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.outercontainer}>
        {showSuccess ? (
          <View style={styles.successContainer}>
            <LottieView
              source={require('../../assets/lottie/done.json')}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <Text style={styles.successText}>Account Created Successfully</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>LOGO HERE</Text>
            </View>

            {/* Business details form card */}
            <View style={styles.card}>
              <Text style={styles.title}>Business Details</Text>

              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#2222' }]}
                placeholder="Joe Rogan "
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>Business Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#2222' }]}
                placeholder="Joe@yahooo.com"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>Business Location</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#2222' }]}
                placeholder="Nevada"
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>Category</Text>
              <MultiSelectComponent />

              <TouchableOpacity style={{ width: "100%" }} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#4A47A3', '#B295F8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>SUBMIT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.scrollSpacer} />
          </ScrollView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outercontainer: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#111',
    paddingBottom: 200,
    minHeight: "100%",
    paddingVertical: 20,
  },
  logoPlaceholder: {
    alignSelf: 'baseline',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#4A47A3',
    shadowOpacity: 0.7,
    shadowOffset: { width: 1, height: -4 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 30,
    alignSelf: 'baseline',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
    fontSize: 16,
    color: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollSpacer: {
    height: 200,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  lottie: {
    width: 150,
    height: 150,
  },
  successText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Bdetails;