import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import useChangePassword from '../../hooks/useChangePassword';

// Reusable Header Component
const Header = ({ title, onMenuPress, onBackPress }) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBackPress}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
      <Ionicons name="chevron-back" size={28} color="#333333" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity
      onPress={onMenuPress}
      accessibilityLabel="Open menu"
      accessibilityRole="button"
    >
      <Ionicons name="menu" size={28} color="#333333" />
    </TouchableOpacity>
  </View>
);

// Reusable Form Field Component
const FormField = React.memo(({ label, value, onChange, placeholder, accessibilityLabel, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      secureTextEntry={secureTextEntry}
      accessibilityLabel={accessibilityLabel}
    />
  </View>
));

// Form Configuration
const formConfig = [
  { key: 'oldPassword', label: 'Old Password', placeholder: 'Enter old password', secureTextEntry: true, required: true },
  { key: 'newPassword', label: 'New Password', placeholder: 'Enter new password', secureTextEntry: true, required: true },
  { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm new password', secureTextEntry: true, required: true },
];

// ChangePasswordScreen Component
const ChangePasswordScreen = () => {
  const nav = useNavigation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { changePassword, isLoading, error } = useChangePassword();

  // Handle form input changes
  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle password change
  const handleChangePassword = useCallback(async () => {
    const { oldPassword, newPassword, confirmPassword } = formData;

    // Validate inputs
    for (const field of formConfig) {
      if (field.required && !formData[field.key]) {
        Alert.alert('Error', `Please fill ${field.label.toLowerCase()} field.`);
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword, confirmPassword });
      Alert.alert('Success', 'Password changed successfully.', [
        { text: 'OK', onPress: () => {
          setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
          router.back();
        }}
      ]);
    } catch (err) {
      Alert.alert('Error', error || 'Failed to change password.');
    }
  }, [formData, changePassword, error, router]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Change Password"
        onMenuPress={() => nav.openDrawer()}
        onBackPress={() => router.back()}
      />
      <ScrollView style={styles.formContainer}>
        {formConfig.map(field => (
          <FormField
            key={field.key}
            label={field.label}
            value={formData[field.key]}
            onChange={(text) => handleChange(field.key, text)}
            placeholder={field.placeholder}
            accessibilityLabel={field.label}
            secureTextEntry={field.secureTextEntry}
          />
        ))}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={isLoading}
          accessibilityLabel="Change password"
          accessibilityRole="button"
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Changing...' : 'Change Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#564DCC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.7,
  },
});