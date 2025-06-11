import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, Camera } from 'expo-camera';
import useUploadPurchaseData from '../../hooks/useUploadPurchaseData';

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

// Common Form Fields Component
const CommonFormFields = ({ formData, setFormData, images, setImages }) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannerField, setScannerField] = useState(null);

  const dropdownOptions = [
    { label: 'Select Type', value: '' },
    { label: 'Serial Number', value: 'serial' },
    { label: 'IMEI Number', value: 'imei' },
  ];

  const statusOptions = [
    { label: 'Warranty', value: '0' },
    { label: 'Out of Warranty', value: '1' },
    { label: 'Damaged', value: '2' },
    { label: 'Lost', value: '3' },
    { label: 'Stolen', value: '4' },
  ];

  const storageOptions = [
    { label: 'Select Storage', value: '' },
    { label: '32GB', value: '32GB' },
    { label: '64GB', value: '64GB' },
    { label: '128GB', value: '128GB' },
    { label: '256GB', value: '256GB' },
    { label: '512GB', value: '512GB' },
    { label: '1TB', value: '1TB' },
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

  const handleScan = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please grant camera access to scan QR codes or barcodes.');
      return;
    }
    setScannerVisible(true);
  };

  const onBarcodeScanned = ({ data }) => {
    setScannerVisible(false);
    if (!data) {
      Alert.alert('Error', 'No data found in QR code or barcode.');
      return;
    }

    if (formData.serialType === 'serial' && scannerField === 'serialNumber') {
      setFormData({ ...formData, serialNumber: data });
    } else if (formData.serialType === 'imei') {
      if (scannerField === 'imei1') {
        setFormData({ ...formData, imei1: data });
      } else if (scannerField === 'imei2') {
        setFormData({ ...formData, imei2: data });
      } else {
        const imeiParts = data.split(',').map((part) => part.trim());
        if (imeiParts.length === 2) {
          setFormData({ ...formData, imei1: imeiParts[0], imei2: imeiParts[1] });
        } else {
          setFormData({ ...formData, imei1: data });
        }
      }
    } else {
      Alert.alert('Error', 'Please select Serial Number or IMEI Number first.');
    }
  };

  return (
    <>
      <CustomInput
        label="Item Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Enter item name"
        accessibilityLabel="Item name"
      />
      <CustomDropdown
        label="Storage"
        value={formData.storage}
        options={storageOptions}
        onSelect={(value) => setFormData({ ...formData, storage: value })}
        placeholder="Select Storage"
      />
      <CustomDropdown
        label="Serial/IMEI"
        value={formData.serialType}
        options={dropdownOptions}
        onSelect={(value) => setFormData({ ...formData, serialType: value })}
        placeholder="Select Type"
      />
      {formData.serialType === 'serial' && (
        <ScanInput
          label="Serial Number"
          value={formData.serialNumber}
          onChangeText={(text) => setFormData({ ...formData, serialNumber: text })}
          onScan={() => {
            setScannerField('serialNumber');
            handleScan();
          }}
          placeholder="Enter serial number"
          accessibilityLabel="Serial number"
        />
      )}
      {formData.serialType === 'imei' && (
        <>
          <ScanInput
            label="IMEI Number 1"
            value={formData.imei1}
            onChangeText={(text) => setFormData({ ...formData, imei1: text })}
            onScan={() => {
              setScannerField('imei1');
              handleScan();
            }}
            placeholder="Enter IMEI number 1"
            accessibilityLabel="IMEI number 1"
          />
          <ScanInput
            label="IMEI Number 2"
            value={formData.imei2}
            onChangeText={(text) => setFormData({ ...formData, imei2: text })}
            onScan={() => {
              setScannerField('imei2');
              handleScan();
            }}
            placeholder="Enter IMEI number 2"
            accessibilityLabel="IMEI number 2"
          />
        </>
      )}
      <CustomDropdown
        label="Product Status"
        value={formData.status}
        options={statusOptions}
        onSelect={(value) => setFormData({ ...formData, status: value })}
        placeholder="Select Status"
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
        label="Battery Health (%)"
        value={formData.batteryHealth}
        onChangeText={(text) => setFormData({ ...formData, batteryHealth: text })}
        placeholder="Enter battery health"
        keyboardType="numeric"
        accessibilityLabel="Battery health"
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

// Purchase Form Component
const PurchaseForm = ({ onSave, onCancel, initialData = {}, initialSellerDetails = {}, productId }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialType: '',
    serialNumber: '',
    imei1: '',
    imei2: '',
    description: '',
    batteryHealth: '',
    price: '',
    status: '',
    storage: '',
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
  const { uploadData, isLoading, error, success } = useUploadPurchaseData();

  useEffect(() => {
    if (success) {
      Alert.alert('Success', productId ? 'Purchase updated successfully.' : 'Purchase data uploaded successfully.');
      setFormData({
        name: '',
        serialType: '',
        serialNumber: '',
        imei1: '',
        imei2: '',
        description: '',
        batteryHealth: '',
        price: '',
        status: '',
        storage: '',
      });
      setSellerDetails({ name: '', phone: '', village: '' });
      setImages([]);
      setDocuments([]);
      onSave();
    }
    if (error) {
      Alert.alert('Error', error);
    }
  }, [success, error, onSave, productId]);

  const handleSave = async () => {
    if (!productId) {
      if (
        !formData.name ||
        !formData.serialType ||
        !formData.batteryHealth ||
        !formData.price ||
        formData.status === '' ||
        !formData.storage
      ) {
        Alert.alert('Error', 'Please fill all required fields (Name, Serial/IMEI, Battery Health, Price, Product Status, Storage).');
        return;
      }
      if (formData.serialType === 'serial' && !formData.serialNumber) {
        Alert.alert('Error', 'Please enter a serial number.');
        return;
      }
      if (formData.serialType === 'imei' && (!formData.imei1 || !formData.imei2)) {
        Alert.alert('Error', 'Please enter both IMEI numbers.');
        return;
      }
    }

    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0)) {
      Alert.alert('Error', 'Please enter a valid price greater than 0.');
      return;
    }
    if (formData.status && (isNaN(parseInt(formData.status)) || parseInt(formData.status) < 0 || parseInt(formData.status) > 4)) {
      Alert.alert('Error', 'Please select a valid product status.');
      return;
    }

    try {
      await uploadData(formData, sellerDetails, productId || '-1');
    } catch (err) {
      // Error handled in useEffect
    }
  };

  return (
    <ScrollView contentContainerStyle={{ marginBottom: 100 }} style={styles.formContainer}>
      <CommonFormFields formData={formData} setFormData={setFormData} images={images} setImages={setImages} />
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
          accessibilityLabel={productId ? 'Update purchase' : 'Save purchase'}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{isLoading ? 'Saving...' : productId ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityLabel="Cancel purchase"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default PurchaseForm;

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