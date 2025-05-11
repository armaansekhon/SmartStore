import React, { useRef } from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const Verify = () => {
  const Router = useRouter();
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.kview}>
        <View style={styles.container}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>LOGO HERE</Text>
          </View>

          {/* Verification form card */}
          <View style={styles.card}>
            <Text style={styles.title}>Verify Email Address</Text>
            <Text style={styles.subtitle}>
              Want to Change mail ID?{' '}
              <TouchableOpacity onPress={() => Router.back()}>
                <Text style={styles.goBackText}>Go Back</Text>
              </TouchableOpacity>
            </Text>

            <View style={styles.otpContainer}>
              {[0, 1, 2, 3, 4, 5].map((_, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  style={[styles.otpInput, { backgroundColor: '#222' }]}
                  maxLength={1}
                  keyboardType="number-pad"
                  textAlign="center"
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={{ width: '100%', alignSelf: 'center' }}
              onPress={() => Router.push('Bdetails')}
            >
              <LinearGradient
                colors={['#4A47A3', '#B295F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>VERIFY</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.resendText}>Didn't Receive Code? Resend Code</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  kview: {
    flex: 1,
    backgroundColor: '#111',
    padding: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#111',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  logoPlaceholder: {
    alignItems: 'center',
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
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'left',
  },
  goBackText: {
    color: '#B295F8',
    marginLeft: 10,
    top: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',
    marginBottom: 30,
    alignSelf: 'center',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#B295F8',
    textAlign: 'center',
  },
});

export default Verify;