import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import useForgotPassword from '../../hooks/useForgotPassword';

const Forget = () => {
  const Router = useRouter();
  const [email, setEmail] = useState('');
  const { forgotPassword, loading, error } = useForgotPassword();

  const handleConfirm = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      const success = await forgotPassword(email);
      if (success) {
        Alert.alert('Success', 'OTP sent to your email.', [
          { text: 'OK', onPress: () => Router.push({ pathname: '/PassOtp', params: { email } }) },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', error || 'Failed to send OTP. Please try again.', [
        { text: 'OK', onPress: () => Router.push('/login') },
      ]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.kview}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>LOGO HERE</Text>
          </View>

          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Don't want to change?{' '}
            <TouchableOpacity onPress={() => Router.back()}>
              <Text style={{ color: '#3367B1', marginLeft: 10, top: 4 }}>Go Back</Text>
            </TouchableOpacity>
          </Text>

          <Text style={styles.label}>Email ID</Text>
          <TextInput
            placeholder="Enter email"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={{ width: '100%', alignSelf: 'center' }}
            onPress={handleConfirm}
            disabled={loading}
          >
            <LinearGradient
              colors={['#564dcc', '#564dcc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.button, loading && { opacity: 0.7 }]}
            >
              <Text style={styles.buttonText}>{loading ? 'PROCESSING...' : 'CONFIRM'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  kview: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  container: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 180,
    alignItems: 'baseline',
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
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#f1f1f1',
    marginBottom: 30,
    textAlign: 'left',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginBottom: 20,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 30,
    fontSize: 16,
    color: '#000',
  },
});

export default Forget;