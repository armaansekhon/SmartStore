import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, Camera } from 'expo-camera';
import useUploadPurchaseData from '../../hooks/useUploadPurchaseData';

// Common Form Fields Component
const CommonFormFields = ({ formData, setFormData, images, setImages }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
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

  const removeImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
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
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Enter item name"
        placeholderTextColor="#888"
        accessibilityLabel="Item name"
      />

      <Text style={styles.label}>Serial/IMEI</Text>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setDropdownVisible(true)}
        accessibilityLabel="Select serial or IMEI type"
        accessibilityRole="button"
      >
        <Text style={styles.dropdownText}>
          {dropdownOptions.find((option) => option.value === formData.serialType)?.label || 'Select Type'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
          accessibilityLabel="Close dropdown"
          accessibilityRole="button"
        >
          <View style={styles.dropdownModal}>
            {dropdownOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => {
                  setFormData({ ...formData, serialType: option.value });
                  setDropdownVisible(false);
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

      {formData.serialType === 'serial' && (
        <>
          <Text style={styles.label}>Serial Number</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={formData.serialNumber}
              onChangeText={(text) => setFormData({ ...formData, serialNumber: text })}
              placeholder="Enter serial number"
              placeholderTextColor="#888"
              accessibilityLabel="Serial number"
            />
            <TouchableOpacity
              style={styles.scanIcon}
              onPress={() => {
                setScannerField('serialNumber');
                handleScan();
              }}
              accessibilityLabel="Scan serial number"
              accessibilityRole="button"
            >
              <Ionicons name="barcode-outline" size={24} color="#564dcc" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {formData.serialType === 'imei' && (
        <>
          <Text style={styles.label}>IMEI Number 1</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={formData.imei1}
              onChangeText={(text) => setFormData({ ...formData, imei1: text })}
              placeholder="Enter IMEI number 1"
              placeholderTextColor="#888"
              accessibilityLabel="IMEI number 1"
            />
            <TouchableOpacity
              style={styles.scanIcon}
              onPress={() => {
                setScannerField('imei1');
                handleScan();
              }}
              accessibilityLabel="Scan IMEI number 1"
              accessibilityRole="button"
            >
              <Ionicons name="barcode-outline" size={24} color="#564dcc" />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>IMEI Number 2</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={[styles.input, styles.inputWithIconInput]}
              value={formData.imei2}
              onChangeText={(text) => setFormData({ ...formData, imei2: text })}
              placeholder="Enter IMEI number 2"
              placeholderTextColor="#888"
              accessibilityLabel="IMEI number 2"
            />
            <TouchableOpacity
              style={styles.scanIcon}
              onPress={() => {
                setScannerField('imei2');
                handleScan();
              }}
              accessibilityLabel="Scan IMEI number 2"
              accessibilityRole="button"
            >
              <Ionicons name="barcode-outline" size={24} color="#564dcc" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <Text style={styles.label}>Product Status</Text>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setStatusDropdownVisible(true)}
        accessibilityLabel="Select product status"
        accessibilityRole="button"
      >
        <Text style={styles.dropdownText}>
          {statusOptions.find((option) => option.value === formData.status)?.label || 'Select Status'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={statusDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setStatusDropdownVisible(false)}
          accessibilityLabel="Close status dropdown"
          accessibilityRole="button"
        >
          <View style={styles.dropdownModal}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => {
                  setFormData({ ...formData, status: option.value });
                  setStatusDropdownVisible(false);
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

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Enter description"
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        accessibilityLabel="Description"
      />

      <Text style={styles.label}>Battery Health (%)</Text>
      <TextInput
        style={styles.input}
        value={formData.batteryHealth}
        onChangeText={(text) => setFormData({ ...formData, batteryHealth: text })}
        placeholder="Enter battery health"
        placeholderTextColor="#888"
        keyboardType="numeric"
        accessibilityLabel="Battery health"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        placeholder="Enter price"
        placeholderTextColor="#888"
        keyboardType="numeric"
        accessibilityLabel="Price"
      />

      <Text style={styles.label}>Images</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleImageUpload}
        accessibilityLabel="Upload images"
        accessibilityRole="button"
      >
        <Text style={styles.uploadButtonText}>Upload Images</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <>
          <Text style={styles.label}>Image Previews</Text>
          <FlatList
            horizontal
            data={images}
            renderItem={({ item }) => (
              <View style={styles.previewContainer}>
                <Image source={{ uri: item.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(item.id)}
                  accessibilityLabel="Remove image"
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
        </>
      )}

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
                barcodeTypes: [
                  'qr',
                  'code128',
                  'code39',
                  'ean13',
                  'ean8',
                  'upc_a',
                  'upc_e',
                ],
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

  const removeDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
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
          <Text style={styles.label}>{type} Name</Text>
          <TextInput
            style={styles.input}
            value={details.name}
            onChangeText={(text) => setDetails({ ...details, name: text })}
            placeholder={`Enter ${type.toLowerCase()} name`}
            placeholderTextColor="#888"
            accessibilityLabel={`${type} name`}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={details.phone}
            onChangeText={(text) => setDetails({ ...details, phone: text })}
            placeholder="Enter phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            accessibilityLabel={`${type} phone number`}
          />

          <Text style={styles.label}>Village</Text>
          <TextInput
            style={styles.input}
            value={details.village}
            onChangeText={(text) => setDetails({ ...details, village: text })}
            placeholder="Enter village"
            placeholderTextColor="#888"
            accessibilityLabel={`${type} village`}
          />

          <Text style={styles.label}>Documents</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleDocumentUpload}
            accessibilityLabel={`Upload ${type.toLowerCase()} documents`}
            accessibilityRole="button"
          >
            <Text style={styles.uploadButtonText}>Upload Documents</Text>
          </TouchableOpacity>

          {documents.length > 0 && (
            <>
              <Text style={styles.label}>Document Previews</Text>
              <FlatList
                horizontal
                data={documents}
                renderItem={({ item }) => (
                  <View style={styles.previewContainer}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.previewImage}
                      onError={() => console.warn(`Failed to load document: ${item.name}`)}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeDocument(item.id)}
                      accessibilityLabel="Remove document"
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
            </>
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
    // Validation relaxed for updates: only check critical fields if creating new
    if (!productId) {
      if (!formData.name || !formData.serialType || !formData.batteryHealth || !formData.price || formData.status === '') {
        Alert.alert('Error', 'Please fill all required fields (Name, Serial/IMEI, Battery Health, Price, Product Status).');
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
    <ScrollView style={styles.formContainer}>
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
          accessibilityLabel={productId ? "Update purchase" : "Save purchase"}
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
    </ScrollView>
  );
};

export default PurchaseForm;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3a3a3a',
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
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    width: '80%',
    padding: 10,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#fff',
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
    backgroundColor: '#333',
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
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginVertical: 10,
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
    backgroundColor: '#3a3a3a',
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