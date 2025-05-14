import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useLogin from '../../hooks/useLogin';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const Router = useRouter();
  const { login, loading, error } = useLogin();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const response = await login({ email, password });
      if (!response.accessToken || !response.userToken || !response.userId) {
        Alert.alert('Warning', 'Login successful, but some data is missing. Please contact support.');
      } else {
        Alert.alert('Success', 'Logged in successfully!');
      }

      // Redirect based on FirstLogin
      const firstLogin = response.firstLogin || 'False';
      if (firstLogin === 'True') {
        console.log('Redirecting to /BusinessDetails due to FirstLogin: True');
        Router.replace('/Bdetails');
      } else {
        console.log('Redirecting to /(drawer) due to FirstLogin:', firstLogin);
        Router.replace('/(drawer)');
      }
    } catch (err) {
      console.log('Login Error:', { error, message: err.message });
      let errorMessage = 'Failed to log in. Please try again.';
      if (error?.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password. Please try again or sign up.';
      } else if (error?.includes('Invalid JSON')) {
        errorMessage = 'Server returned invalid data. Please try again later.';
      } else if (error?.includes('No response data')) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error?.includes('Missing required fields')) {
        errorMessage = 'Incomplete server response. Please try again later.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="light-content" backgroundColor="#111" />

        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO HERE</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>

          <Text style={styles.label}>Email ID</Text>
          <TextInput
            placeholder="xyz@gmail.com"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { backgroundColor: '#222' }]}
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="*****"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { backgroundColor: '#222' }]}
            secureTextEntry
            placeholderTextColor="#aaa"
            autoCapitalize="none"
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={rememberMe ? 'checkbox-outline' : 'square-outline'}
                size={22}
                color="#fff"
              />
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Router.push('/Forget')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#564dcc', '#564dcc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.button, loading && { opacity: 0.7 }]}
            >
              <Text style={styles.buttonText}>
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don’t have an account?
            <TouchableOpacity onPress={() => Router.push('/SignUp')}>
              <Text style={styles.linkText}> Sign up</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom:100,
    justifyContent: 'center',
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
    backgroundColor: '#000',
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
    marginBottom: 30,
    color: '#564dcc',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#fff',
  },
  input: {
    borderRadius: 5,
    padding: 12,
    marginBottom: 30,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#fff',
  },
  forgotText: {
    color: '#564dcc',
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomText: {
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  linkText: {
    color: '#564dcc',
    fontWeight: '600',
    top: 4,
    left: 7,
  },
});