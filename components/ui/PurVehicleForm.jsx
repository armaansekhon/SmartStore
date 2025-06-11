import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, Camera } from 'expo-camera';
import useUploadVehiclePurchaseData from '../../hooks/useUploadVehicleData';

// Validate DD/MM/YYYY date format
const isValidDate = (dateStr) => {
  if (!dateStr) return true; // Allow empty dates
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 9999) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
};

// Reusable Input Component
const CustomInput = ({ label, value, onChangeText, placeholder, keyboardType, multiline, numberOfLines, accessibilityLabel, style }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
    />
  </View>
);

// Reusable Dropdown Component
const CustomDropdown = ({ label, value, options, onSelect, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setVisible(true)}
        accessibilityLabel={`Select ${label.toLowerCase()}`}
        accessibilityRole="button"
      >
        <Text style={styles.dropdownText}>
          {options.find((option) => option.value === value)?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
          accessibilityLabel={`Close ${label.toLowerCase()} dropdown`}
          accessibilityRole="button"
        >
          <View style={styles.dropdownModal}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => {
                  onSelect(option.value);
                  setVisible(false);
                }}
                accessibilityLabel={option.label}
                accessibilityRole="menuitem"
              >
                <Text style={styles.dropdownOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Reusable Scan Input Component
const ScanInput = ({ label, value, onChangeText, onScan, placeholder, accessibilityLabel }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWithIcon}>
      <TextInput
        style={[styles.input, styles.inputWithIconInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        accessibilityLabel={accessibilityLabel}
      />
      <TouchableOpacity
        style={styles.scanIcon}
        onPress={onScan}
        accessibilityLabel={`Scan ${label.toLowerCase()}`}
        accessibilityRole="button"
      >
        <Ionicons name="barcode-outline" size={24} color="#564dcc" />
      </TouchableOpacity>
    </View>
  </View>
);

// Reusable Image/Document Preview Component
const PreviewList = ({ items, onRemove, isImage = true }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{isImage ? 'Image Previews' : 'Document Previews'}</Text>
    <FlatList
      horizontal
      data={items}
      renderItem={({ item }) => (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: item.uri }}
            style={styles.previewImage}
            onError={() => console.warn(`Failed to load ${isImage ? 'image' : 'document'}: ${item.name || item.id}`)}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
            accessibilityLabel={`Remove ${isImage ? 'image' : 'document'}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item) => item.id}
      style={styles.previewList}
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

// Common Vehicle Form Fields Component
const CommonVehicleFormFields = ({ formData, setFormData, images, setImages }) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannerField, setScannerField] = useState(null);

  const statusOptions = [
    { label: 'Warranty', value: '0' },
    { label: 'Out of Warranty', value: '1' },
    { label: 'Damaged', value: '2' },
    { label: 'Lost', value: '3' },
    { label: 'Stolen', value: '4' },
  ];

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant photo library access to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}`,
        uri: asset.uri,
      }));
      setImages([...images, ...newImages]);
      Alert.alert('Success', `${newImages.length} image(s) uploaded.`);
    }
  };

  const handleScan = async (field) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant camera access to scan QR codes or barcodes.');
      return;
    }
    setScannerField(field);
    setScannerVisible(true);
  };

  const onBarcodeScanned = ({ data }) => {
    setScannerVisible(false);
    if (!data) {
      Alert.alert('Error', 'No data found in QR code or barcode.');
      return;
    }

    if (scannerField === 'engineNumber') {
      setFormData({ ...formData, engineNumber: data });
    } else if (scannerField === 'chassisNumber') {
      setFormData({ ...formData, chassisNumber: data });
    }
  };

  return (
    <>
      <CustomInput
        label="Vehicle Name"
        value={formData.vehicleName}
        onChangeText={(text) => setFormData({ ...formData, vehicleName: text })}
        placeholder="Enter vehicle name"
        accessibilityLabel="Vehicle name"
      />
      <CustomInput
        label="Model (Month and Year)"
        value={formData.model}
        onChangeText={(text) => setFormData({ ...formData, model: text })}
        placeholder="e.g., January 2023"
        accessibilityLabel="Vehicle model"
      />
      <CustomInput
        label="Color"
        value={formData.color}
        onChangeText={(text) => setFormData({ ...formData, color: text })}
        placeholder="Enter vehicle color"
        accessibilityLabel="Vehicle color"
      />
      <CustomInput
        label="Owner"
        value={formData.owner}
        onChangeText={(text) => setFormData({ ...formData, owner: text })}
        placeholder="Enter owner name"
        accessibilityLabel="Owner name"
      />
      <ScanInput
        label="Engine Number"
        value={formData.engineNumber}
        onChangeText={(text) => setFormData({ ...formData, engineNumber: text })}
        onScan={() => handleScan('engineNumber')}
        placeholder="Enter engine number"
        accessibilityLabel="Engine number"
      />
      <ScanInput
        label="Chassis Number"
        value={formData.chassisNumber}
        onChangeText={(text) => setFormData({ ...formData, chassisNumber: text })}
        onScan={() => handleScan('chassisNumber')}
        placeholder="Enter chassis number"
        accessibilityLabel="Chassis number"
      />
      <CustomDropdown
        label="Vehicle Status"
        value={formData.status}
        options={statusOptions}
        onSelect={(value) => setFormData({ ...formData, status: value })}
        placeholder="Select Status"
      />
      <CustomInput
        label="Insurance Valid Date"
        value={formData.insuranceValidDate}
        onChangeText={(text) => setFormData({ ...formData, insuranceValidDate: text })}
        placeholder="DD/MM/YYYY"
        accessibilityLabel="Insurance valid date"
      />
      <CustomInput
        label="Tyre Condition (%)"
        value={formData.tyreCondition}
        onChangeText={(text) => setFormData({ ...formData, tyreCondition: text })}
        placeholder="Enter tyre condition percentage"
        keyboardType="numeric"
        accessibilityLabel="Tyre condition"
      />
      <CustomInput
        label="Number of Keys"
        value={formData.numberOfKeys}
        onChangeText={(text) => setFormData({ ...formData, numberOfKeys: text })}
        placeholder="Enter number of keys"
        keyboardType="numeric"
        accessibilityLabel="Number of keys"
      />
      <CustomInput
        label="Condition or Fault"
        value={formData.condition}
        onChangeText={(text) => setFormData({ ...formData, condition: text })}
        placeholder="Enter condition or any faults"
        multiline
        numberOfLines={4}
        accessibilityLabel="Condition or fault"
      />
      <CustomInput
        label="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Enter description"
        multiline
        numberOfLines={4}
        accessibilityLabel="Description"
      />
      <CustomInput
        label="Permit Expiry Date"
        value={formData.permitExpiryDate}
        onChangeText={(text) => setFormData({ ...formData, permitExpiryDate: text })}
        placeholder="DD/MM/YYYY"
        accessibilityLabel="Permit expiry date"
      />
      <CustomInput
        label="Price"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        placeholder="Enter price"
        keyboardType="numeric"
        accessibilityLabel="Price"
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Images</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageUpload}
          accessibilityLabel="Upload images"
          accessibilityRole="button"
        >
          <Text style={styles.uploadButtonText}>Upload Images</Text>
        </TouchableOpacity>
      </View>
      {images.length > 0 && <PreviewList items={images} onRemove={(id) => setImages(images.filter((image) => image.id !== id))} />}
      {scannerVisible && (
        <Modal
          visible={scannerVisible}
          animationType="slide"
          onRequestClose={() => setScannerVisible(false)}
        >
          <View style={styles.scannerContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={onBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8', 'upc_a', 'upc_e'],
              }}
            />
            <TouchableOpacity
              style={styles.closeScannerButton}
              onPress={() => setScannerVisible(false)}
              accessibilityLabel="Close scanner"
              accessibilityRole="button"
            >
              <Text style={styles.closeScannerText}>Close Scanner</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

// Seller Details Component
const DetailsForm = ({ type, details, setDetails, documents, setDocuments }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDocumentUpload = async () => {
    try {
      const results = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (!results.canceled) {
        const newDocuments = results.assets.map((doc, index) => ({
          id: `${Date.now()}-${index}`,
          uri: doc.uri,
          name: doc.name,
        }));
        setDocuments([...documents, ...newDocuments]);
        Alert.alert('Success', `${newDocuments.length} document(s) uploaded.`);
      }
    } catch (err) {
      Alert.alert('Error', `Document picker error: ${err.message}`);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowDetails(!showDetails)}
        accessibilityLabel={`Add ${type} details`}
        accessibilityRole="button"
      >
        <Text style={styles.addButtonText}>
          {showDetails ? `Hide ${type} Details` : `Add ${type} Details`}
        </Text>
      </TouchableOpacity>
      {showDetails && (
        <View style={styles.detailsContainer}>
          <CustomInput
            label={`${type} Name`}
            value={details.name}
            onChangeText={(text) => setDetails({ ...details, name: text })}
            placeholder={`Enter ${type.toLowerCase()} name`}
            accessibilityLabel={`${type} name`}
          />
          <CustomInput
            label="Phone Number"
            value={details.phone}
            onChangeText={(text) => setDetails({ ...details, phone: text })}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            accessibilityLabel={`${type} phone number`}
          />
          <CustomInput
            label="Village"
            value={details.village}
            onChangeText={(text) => setDetails({ ...details, village: text })}
            placeholder="Enter village"
            accessibilityLabel={`${type} village`}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Documents</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleDocumentUpload}
              accessibilityLabel={`Upload ${type.toLowerCase()} documents`}
              accessibilityRole="button"
            >
              <Text style={styles.uploadButtonText}>Upload Documents</Text>
            </TouchableOpacity>
          </View>
          {documents.length > 0 && (
            <PreviewList
              items={documents}
              onRemove={(id) => setDocuments(documents.filter((doc) => doc.id !== id))}
              isImage={false}
            />
          )}
        </View>
      )}
    </>
  );
};

// Vehicle Purchase Form Component
const PurVehicleForm = ({ onSave, onCancel, initialData = {}, initialSellerDetails = {}, vehicleId }) => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    model: '',
    color: '',
    owner: '',
    engineNumber: '',
    chassisNumber: '',
    status: '',
    insuranceValidDate: '',
    tyreCondition: '',
    numberOfKeys: '',
    condition: '',
    description: '',
    permitExpiryDate: '',
    price: '',
    ...initialData,
  });
  const [sellerDetails, setSellerDetails] = useState({
    name: '',
    phone: '',
    village: '',
    ...initialSellerDetails,
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { uploadData, isLoading, error, success } = useUploadVehiclePurchaseData();

  useEffect(() => {
    if (success) {
      Alert.alert('Success', vehicleId ? 'Vehicle purchase updated successfully.' : 'Vehicle purchase data uploaded successfully.');
      setFormData({
        vehicleName: '',
        model: '',
        color: '',
        owner: '',
        engineNumber: '',
        chassisNumber: '',
        status: '',
        insuranceValidDate: '',
        tyreCondition: '',
        numberOfKeys: '',
        condition: '',
        description: '',
        permitExpiryDate: '',
        price: '',
      });
      setSellerDetails({ name: '', phone: '', village: '' });
      setImages([]);
      setDocuments([]);
      onSave();
    }
    if (error) {
      Alert.alert('Error', error);
    }
  }, [success, error, onSave, vehicleId]);

  const handleSave = async () => {
    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)) {
      Alert.alert('Error', 'Please enter a valid price greater than 0.');
      return;
    }

    if (formData.tyreCondition && (isNaN(parseFloat(formData.tyreCondition)) || parseFloat(formData.tyreCondition) < 0 || parseFloat(formData.tyreCondition) > 100)) {
      Alert.alert('Error', 'Please enter a valid tyre condition percentage (0-100).');
      return;
    }

    if (formData.numberOfKeys && (isNaN(parseInt(formData.numberOfKeys)) || parseInt(formData.numberOfKeys) < 0)) {
      Alert.alert('Error', 'Please enter a valid number of keys (0 or more).');
      return;
    }

    if (formData.status && (isNaN(parseInt(formData.status)) || parseInt(formData.status) < 0 || parseInt(formData.status) > 4)) {
      Alert.alert('Error', 'Please select a valid vehicle status.');
      return;
    }

    if (formData.insuranceValidDate && !isValidDate(formData.insuranceValidDate)) {
      Alert.alert('Error', 'Please enter a valid Insurance Valid Date in DD/MM/YYYY format.');
      return;
    }

    if (formData.permitExpiryDate && !isValidDate(formData.permitExpiryDate)) {
      Alert.alert('Error', 'Please enter a valid Permit Expiry Date in DD/MM/YYYY format.');
      return;
    }

    try {
      await uploadData(formData, sellerDetails, images, documents, vehicleId || '-1');
    } catch (err) {
      // Error handled in useEffect
    }
  };

  return (
    <ScrollView contentContainerStyle={{ marginBottom: 100 }} style={styles.formContainer}>
      <CommonVehicleFormFields formData={formData} setFormData={setFormData} images={images} setImages={setImages} />
      <DetailsForm
        type="Seller"
        details={sellerDetails}
        setDetails={setSellerDetails}
        documents={documents}
        setDocuments={setDocuments}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
          accessibilityLabel={vehicleId ? 'Update vehicle purchase' : 'Save vehicle purchase'}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{isLoading ? 'Saving...' : vehicleId ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityLabel="Cancel vehicle purchase"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default PurVehicleForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  bottomSpacer: {
    height: 150,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithIconInput: {
    flex: 1,
  },
  scanIcon: {
    marginLeft: 10,
    padding: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '80%',
    padding: 10,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#564dcc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewList: {
    marginVertical: 10,
  },
  previewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 4,
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  closeScannerButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    alignItems: 'center',
    margin: 20,
    borderRadius: 8,
  },
  closeScannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});