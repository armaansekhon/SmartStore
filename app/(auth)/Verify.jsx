import React, { useRef, useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import useVerifyOTP from '../../hooks/useVerifyOTP';

const Verify = () => {
  const Router = useRouter();
  const { email } = useLocalSearchParams(); // Get email from navigation params
  const inputs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // State for 6 OTP digits
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const { verifyOTP, resendOTP, loading, error } = useVerifyOTP();

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (text, index) => {
    // Ensure only digits are entered
    if (text && !/^\d$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    // Validate OTP
    const otpCode = otp.join('');
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please try signing up again.');
      return;
    }

    // Prepare payload
    const payload = {
      sentTo: email,
      isEmail: true,
      inputotp: otpCode,
    };

    try {
      console.log('Verify OTP Payload:', payload);
      await verifyOTP(payload);
      Alert.alert('Success', 'OTP verified successfully!');
      Router.replace('/Bdetails');
    } catch (err) {
      console.log('Verify OTP Error:', { error, message: err.message });
      Alert.alert('Error', error || 'Failed to verify OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Please try signing up again.');
      return;
    }

    try {
      console.log('Resend OTP Request:', { Email: email });
      await resendOTP({ Email: email });
      Alert.alert('Success', 'A new OTP has been sent to your email.');
      setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      setTimeLeft(120); // Reset timer to 2 minutes
      inputs.current[0]?.focus(); // Focus first input
    } catch (err) {
      console.log('Resend OTP Error:', { error, message: err.message });
      Alert.alert('Error', error || 'Failed to resend OTP. Please try again.');
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

            <Text style={styles.timerText}>
              OTP valid for: {formatTime(timeLeft)}
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
                  value={otp[index]}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={{ width: '100%', alignSelf: 'center' }}
              onPress={handleVerify}
              disabled={loading}
            >
              <LinearGradient
                colors={['#4A47A3', '#B295F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, loading && { opacity: 0.7 }]}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'VERIFYING...' : 'VERIFY'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResend}
              disabled={timeLeft > 0 || loading}
              style={[styles.resendButton, (timeLeft > 0 || loading) && { opacity: 0.5 }]}
            >
              <Text style={styles.resendText}>Didn't Receive Code? Resend Code</Text>
            </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: 'left',
  },
  goBackText: {
    color: '#B295F8',
    marginLeft: 10,
    top: 4,
  },
  timerText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
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
  resendButton: {
    marginTop: 10,
  },
  resendText: {
    fontSize: 16,
    color: '#B295F8',
    textAlign: 'center',
  },
});

export default Verify;