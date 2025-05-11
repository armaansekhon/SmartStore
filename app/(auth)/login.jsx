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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const Router = useRouter();

  const handleLogin = () => {
    if (email.trim() !== '' && password.trim() !== '') {
      Router.push('/(drawer)');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="light-content" backgroundColor="#111" />

        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO HERE</Text>
        </View>

        {/* Sign-in form card */}
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>

          <Text style={styles.label}>Email ID</Text>
          <TextInput
            placeholder="xyz@gmail.com"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { backgroundColor: '#2222' }]}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="*****"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { backgroundColor: '#2222' }]}
            secureTextEntry
            placeholderTextColor="#aaa"
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

            <TouchableOpacity onPress={() => Router.push("Forget")}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
            <LinearGradient
              colors={['#4A47A3', '#B295F8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>SIGN IN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Don’t have an account?
            <TouchableOpacity onPress={() => Router.push("/SignUp")}>
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
    backgroundColor: '#111',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
    marginBottom: 30,
    color: '#B295F8',

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
    color: '#B295F8',
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
    color: '#B295F8',
    fontWeight: '600',
    top: 4,
    left: 7,
  },
});