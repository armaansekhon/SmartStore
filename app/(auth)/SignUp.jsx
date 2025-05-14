import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useSignUp from '../../hooks/useSignUp';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const Router = useRouter();
  const { signUp, loading, error } = useSignUp();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    // Client-side validations
    if (!firstName.trim()) {
      Alert.alert('Error', 'First Name is required.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last Name is required.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password is required.');
      return;
    }
    if (!confirmPassword) {
      Alert.alert('Error', 'Confirm Password is required.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the Terms & Conditions.');
      return;
    }

    // Prepare payload (removed id field as it's likely not needed)
    const payload = {
      FirstName: firstName.trim(),
      LastName: lastName.trim(),
      Email: email.trim(),
      Password: password,
      id:"-1",
    };

    try {
      await signUp(payload);
      Alert.alert('Success', 'Sign-up successful! Redirecting to verification...');
  Router.push({ pathname: '/Verify', params: { email: email.trim() } });
    } catch (err) {
      // Enhanced error display to show specific error message
      console.log('SignUp Error:', error);
      Alert.alert('Error', error || err.message || 'An error occurred during sign-up. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* Top Image Section */}
        <ImageBackground
          source={require("../../assets/images/signup.jpeg")}
          style={styles.topImage}
          imageStyle={{ opacity: 0.7 }}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.welcomeTitle, { color: '#fff' }]}>
              Get Started
            </Text>
            <Text style={[styles.subtitle, { color: '#fff' }]}>
              Track your inventory effortlessly with our app.
            </Text>
          </View>
        </ImageBackground>

        {/* Bottom Sheet Form */}
        <View style={styles.bottomSheet}>
          <LinearGradient
            colors={['#4A47A3', '#B295F8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.handle}
          />
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Sign Up</Text>

            {/* Row for First Name and Last Name */}
            <View style={styles.inputRow}>
              {/* First Name */}
              <View style={styles.inputColumn}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  placeholder="Joe"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={[styles.input, { backgroundColor: '#222' }]}
                  placeholderTextColor="#aaa"
                />
              </View>

              {/* Last Name */}
              <View style={styles.inputColumn}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  placeholder="Rogan"
                  value={lastName}
                  onChangeText={setLastName}
                  style={[styles.input, { backgroundColor: '#222' }]}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            {/* Email ID */}
            <Text style={styles.label}>Email ID</Text>
            <TextInput
              placeholder="xyz@gmail.com"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { backgroundColor: '#222', marginBottom: 20 }]}
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize='none'
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: '#222' }]}>
              <TextInput
                placeholder="*****"
                value={password}
                onChangeText={setPassword}
                style={styles.inputField}
                // secureTextEntry={!passwordVisible}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: '#222' }]}>
              <TextInput
                placeholder="******"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.inputField}
                // secureTextEntry={!confirmPasswordVisible}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Ionicons name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Accept Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={acceptedTerms ? 'checkbox-outline' : 'square-outline'}
                size={22}
                color="#fff"
              />
              <Text style={styles.checkboxLabel}>I accept the Terms & Conditions</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={['#564dcc', '#564dcc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, loading && { opacity: 0.7 }]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'SIGNING UP...' : 'SIGN UP'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login link */}
            <Text style={styles.bottomText}>
              Already have an account?{' '}
              <TouchableOpacity onPress={() => Router.push('/login')}>
                <Text style={[styles.linkText, { color: '#564dcc' }]}>Sign in</Text>
              </TouchableOpacity>
            </Text>
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topImage: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    flex: 0.6,
    backgroundColor: '#000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 5,
    shadowColor: '#4A47A3',
    bottom: 25,
    shadowOpacity: 0.7,
    shadowOffset: { width: 1, height: -4 },
    shadowRadius: 4,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 260,
  },
  textContainer: {
    position: 'absolute',
    left: '5%',
    top: '70%',
    transform: [{ translateY: -50 }],
  },
  gradientText: {
    padding: 2,
  },
  welcomeTitle: {
    fontSize: 38,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: '600',
    width: 240,
  },
  title: {
    fontSize: 30,
    fontWeight: '500',
    marginBottom: 30,
    color: '#564dcc',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputColumn: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  inputField: {
    flex: 1,
    height: 50,
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
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
    fontSize: 16,
    fontWeight: '600',
    top: 4,
    left: 7,
  },
});