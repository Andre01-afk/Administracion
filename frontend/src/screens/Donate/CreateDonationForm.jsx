import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { donationService, uploadService } from "../../services/apiService";
import {Picker} from  '@react-native-picker/picker';

export default function CreateDonationForm({ navigation }) {
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("portions");
  const [photos, setPhotos] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [area, setArea] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [preferredPickupTime, setPreferredPickupTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        // Preparar archivos para subida
        const filesToUpload = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image/jpeg',
          name: asset.fileName || `image-${Date.now()}.jpg`
        }));

        // Subir imágenes al servidor
        const uploadResponse = await uploadService.uploadImages(filesToUpload);
        
        if (uploadResponse.success && uploadResponse.images) {
          // Guardar las URLs de las imágenes subidas
          const imageUrls = uploadResponse.images.map(img => img.url);
          setUploadedPhotos(prev => [...prev, ...imageUrls]);
          setPhotos(prev => [...prev, ...result.assets]);

          Toast.show({
            type: 'success',
            text1: 'Éxito',
            text2: `${uploadResponse.images.length} imagen(es) subida(s)`,
            duration: 2000,
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Error al subir imágenes',
          duration: 2000,
        });
        console.error('Error uploading images:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateDonation = async () => {
    if (!foodType || !quantity || !pickupAddress || !contactNumber || !area) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos requeridos',
        duration: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      // Validar y convertir fecha
      let pickupDateTime = null;
      if (preferredPickupTime && preferredPickupTime.trim()) {
        const parsedDate = new Date(preferredPickupTime);
        if (!isNaN(parsedDate.getTime())) {
          pickupDateTime = parsedDate.toISOString();
        }
      }

      // Usar URLs de imágenes ya subidas al servidor
      await donationService.createDonation({
        foodType,
        approxQuantity: parseInt(quantity),
        quantityUnit,
        area,
        pickupAddress,
        contactNumber,
        preferredPickupTime: pickupDateTime,
        photos: uploadedPhotos.map(url => ({ url })), // URLs del servidor
      });

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Donación creada exitosamente',
        duration: 2000,
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo crear la donación',
        duration: 2000,
      });
      console.log("Error creating donation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/form3.jpg")}
      style={styles.bg}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <BlurView intensity={50} tint="light" style={styles.formCard}>
          <Text style={styles.heading}>Crear Donación</Text>

          {/* Food Type */}
          <Text style={styles.label}>Tipo de Comida</Text>
          <TextInput
            placeholder="E.g., Pizza, Arroz con Pollo"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            value={foodType}
            onChangeText={setFoodType}
          />

          {/* Quantity */}
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            placeholder="E.g., 5"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Unidad</Text>
          <TextInput
            placeholder="E.g., portions, kg, boxes"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            value={quantityUnit}
            onChangeText={setQuantityUnit}
          />

          {/* Photos */}
          <Text style={styles.label}>Fotos del Alimento</Text>
          <TouchableOpacity 
            style={[styles.photoButton, uploading && styles.photoButtonDisabled]} 
            onPress={pickImages}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.photoButtonText}>Subiendo...</Text>
              </>
            ) : (
              <Text style={styles.photoButtonText}>Cargar Fotos</Text>
            )}
          </TouchableOpacity>
          
          {photos.length > 0 && (
            <View style={styles.photosContainer}>
              <Text style={styles.photoCount}>
                {photos.length} foto(s) subida(s)
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.photosScroll}
              >
                {photos.map((photo, index) => (
                  <View key={index} style={styles.photoThumbnail}>
                    <Image 
                      source={{ uri: photo.uri }} 
                      style={styles.photoImage}
                    />
                    <TouchableOpacity 
                      style={styles.photoDeleteButton}
                      onPress={() => removePhoto(index)}
                    >
                      <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Area */}
          <Text style={styles.label}>Zona / Área</Text>
          <TextInput
            placeholder="E.g., Centro, Bandra"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            value={area}
            onChangeText={setArea}
          />

          {/* Pickup Details */}
          <Text style={styles.label}>Dirección de Recogida</Text>
          <TextInput
            placeholder="Dirección completa"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            value={pickupAddress}
            onChangeText={setPickupAddress}
          />

          <Text style={styles.label}>Número de Contacto</Text>
          <TextInput
            placeholder="Número de contacto"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            keyboardType="phone-pad"
            value={contactNumber}
            onChangeText={setContactNumber}
          />

          <Text style={styles.label}>
            Hora preferida de recogida (YYYY-MM-DD HH:mm)
          </Text>
          <TextInput
            placeholder="E.g., 2026-05-27 17:00"
            placeholderTextColor="#eee"
            style={styles.underlineInput}
            value={preferredPickupTime}
            onChangeText={setPreferredPickupTime}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateDonation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear Donación</Text>
            )}
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 25,
  },
  formCard: {
    borderRadius: 25,
    marginTop: 100,
    padding: 25,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  heading: {
    fontSize: 33,
    fontWeight: "800",
    color: "#ffffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 12,
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingVertical: 8,
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: "#ffffffaa",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  photoButtonText: {
    color: "#111",
    fontWeight: "600",
  },
  photoCount: {
    color: "#fff",
    marginBottom: 10,
  },
  button: {
    marginTop: 25,
    backgroundColor: "#fffefeff",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#111111ff",
    fontWeight: "600",
    fontSize: 16,
  },

  photosContainer: {
    marginVertical: 10,
  },
  photosScroll: {
    marginTop: 8,
  },
  photoThumbnail: {
    position: 'relative',
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoDeleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E74C3C',
    borderRadius: 50,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoButtonDisabled: {
    opacity: 0.6,
  },
  pickerContainer:{
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: 10,
    justifyContent: "center",
  },
  picker:{
    color: "#fff",
    marginLeft: -15,
  },
});

