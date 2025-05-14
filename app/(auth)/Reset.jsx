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
import { Ionicons } from '@expo/vector-icons';
import useResetPassword from '../../hooks/UseResetPassword';

const Reset = () => {
  const Router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { resetPassword, loading, error } = useResetPassword();

  const handleConfirm = async () => {
    // Validate password
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const success = await resetPassword(password);
      if (success) {
        Alert.alert('Success', 'Password reset successfully!', [
          { text: 'OK', onPress: () => Router.push('/login') },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', error || 'Failed to reset password. Please try again.');
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

          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              style={styles.inputField}
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.inputField}
              secureTextEntry={!confirmPasswordVisible}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Ionicons
                name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ width: '100%', alignSelf: 'center' }}
            onPress={handleConfirm}
            disabled={loading}
          >
            <LinearGradient
              colors={['#3367B1', '#9285BF']}
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
    backgroundColor: '#fff',
    padding: 10,
  },
  container: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
    color: '#666',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
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
    color: '#000',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  inputField: {
    flex: 1,
    height: 50,
    color: '#000',
  },
});

export default Reset;