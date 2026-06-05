import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { donationService, donorService } from "../../services/apiService";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirstValidPhoto, isValidImageUrl } from "../../utils/imageUtils";
import RatingModal from "../../components/RatingModal";

import { Portal, Dialog, Button as PaperButton, Text as PaperText } from 'react-native-paper';

const DonateScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [donationToCancel, setDonationToCancel] = useState(null);

  const notifiedDonationIdsRef = useRef(new Set());

  const checkNotifications = (loadedDonations) => {
    loadedDonations.forEach(donation => {
      const stateKey = `${donation.id}-${donation.status}`;
      
      if (!notifiedDonationIdsRef.current.has(stateKey)) {
        if (donation.status === 'accepted') {
          Toast.show({
            type: 'info',
            text1: '¡Voluntario en camino!',
            text2: `Tu donación de ${donation.foodType} ha sido aceptada.`,
            position: 'top',
            visibilityTime: 4000,
          });
          notifiedDonationIdsRef.current.add(stateKey); 
        }

        if (donation.status === 'completed' && (!donation.ratings || donation.ratings.length === 0)) {
          Toast.show({
            type: 'success',
            text1: '¡Entrega Completada!',
            text2: `Tu ${donation.foodType} llegó a su destino. ¡Por favor califica al voluntario!`,
            position: 'top',
            visibilityTime: 5000,
          });
          notifiedDonationIdsRef.current.add(stateKey); 
        }
      }
    });
  }

  const opensRating = (donation) => {
    setSelectedDonation(donation);
    setRatingModalVisible(true);
  }

  const submitRating = async (ratingData) => {
    try {
      await donorService.createRating(ratingData);
      Toast.show({
        type: 'success',
        text1: '¡Calificación enviada!',
        position: 'top'
      });
      loadDonations(); 
    } catch (err) {
      console.error("Error al calificar:", err);
    }
  };

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await donationService.getDonations({ donorId: user?.id });
      setDonations(data);
      checkNotifications(data);
    } catch (error) {
      console.log("Error loading donations:", error);
      setError(error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las donaciones',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadDonations();
    });
    return unsubscribe;
  }, [navigation]);

  const promptCancel = (id) => {
    setDonationToCancel(id);
    setCancelDialogVisible(true);
  };

  const confirmCancel = async () => {
    setCancelDialogVisible(false); 
    if (!donationToCancel) return;

    try {
      setLoading(true);
      await donationService.cancelDonation(donationToCancel);
      
      Toast.show({
        type: 'success',
        text1: 'Cancelada',
        text2: 'La donación ha sido retirada exitosamente.',
        position: 'top'
      });
      
      loadDonations(); 
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo cancelar la donación',
        position: 'top'
      });
    } finally {
      setLoading(false);
      setDonationToCancel(null); 
    }
  };

  const handleImageError = (donationId) => {
    setImageErrors(prev => ({ ...prev, [donationId]: true }));
  };

  const renderCard = ({ item }) => {
    const hasImageError = imageErrors[item.id];
    const photoUrl = getFirstValidPhoto(item.photos);
    const hasValidPhoto = photoUrl && isValidImageUrl(photoUrl) && !hasImageError;

    return (
      <View style={styles.card}>
       <View style={styles.imageContainer}>
          {hasValidPhoto ? (
            <Image 
              source={{ uri: photoUrl }} 
              style={styles.foodImage}
              resizeMode="cover"
              onError={() => handleImageError(item.id)}
            />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="fastfood" size={40} color="#9e9e9e" />
              <Text style={styles.placeholderText}>Sin foto</Text>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.foodType}>{item.foodType}</Text>
            <View
              style={[
                styles.statusBadge,
                item.status === "available" ? styles.availableBG : 
                item.status === "accepted" ? styles.acceptedBG : 
                item.status === "completed" ? { backgroundColor: '#3498DB' } : 
                styles.cancelledBG,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.info}>Cantidad: {item.approxQuantity} {item.quantityUnit}</Text>
          <Text style={styles.info}>Zona: {item.area}</Text>
          <Text style={styles.info}>Dirección: {item.pickupAddress}</Text>

          {item.preferredPickupTime && (
            <Text style={styles.info}>Recogida: {new Date(item.preferredPickupTime).toLocaleString()}</Text>
          )}
          
          {item.status === "completed" && (!item.ratings || item.ratings.length === 0) && (
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: '#F1C40F', marginTop: 10 }]}
              onPress={() => opensRating(item)}
            >
              <Text style={[styles.cancelButtonText, { color: '#333', fontWeight: 'bold' }]}>
                Calificar Voluntario
              </Text>
            </TouchableOpacity>
          )}

          {item.status === "completed" && item.ratings && item.ratings.length > 0 && (
            <View style={{ marginTop: 10, alignItems: 'flex-start' }}>
              <Text style={{ color: '#1ABC9C', fontWeight: 'bold' }}>
                 Voluntario Calificado ({item.ratings[0].rating} ⭐)
              </Text>
            </View>
          )}

          {item.status !== "cancelled" && item.status !== "completed" && (
            <TouchableOpacity
              style={[styles.cancelButton, { marginTop: 10 }]}
              onPress={() => promptCancel(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancelar Donación</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ShareMeal</Text>
        <Text style={styles.headerSubtitle}>Dashboard Donante</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Text style={styles.tagline}>
          Comparte la comida que te sobre: ¡alegra el día a alguien!
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateDonationForm")} activeOpacity={0.7}>
          <View style={styles.glassButton}>
            <Text style={styles.glassButtonText}>Crear Donación</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={donations}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ 
          paddingBottom: 30, 
          paddingHorizontal: 15,
          maxWidth: 1000,
          marginHorizontal: 'auto',
          width: '100%',
        }}
        ListHeaderComponent={<Text style={styles.title}>Tus Donaciones</Text>}
      />

      <RatingModal 
        visible={ratingModalVisible}
        onDismiss={() => setRatingModalVisible(false)}
        donation={selectedDonation}
        onSubmitRating={submitRating}
      />

      <Portal>
        <Dialog 
          visible={cancelDialogVisible} 
          onDismiss={() => setCancelDialogVisible(false)}
          style={{ maxWidth: 400, alignSelf: 'center', backgroundColor: 'white' }}
        >
          <Dialog.Title style={{ color: '#E74C3C', fontWeight: 'bold' }}>
            Cancelar Donación
          </Dialog.Title>
          <Dialog.Content>
            <PaperText variant="bodyMedium">
              ¿Estás seguro de que deseas cancelar esta donación? Esta acción la ocultará de los voluntarios y no se puede deshacer.
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton textColor="#7F8C8D" onPress={() => setCancelDialogVisible(false)}>
              No, mantener
            </PaperButton>
            <PaperButton textColor="#E74C3C" onPress={confirmCancel}>
              Sí, cancelar
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { backgroundColor: "#1ABC9C", padding: 22, paddingBottom: 25, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 6 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "white" },
  headerSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 16, marginTop: 2 },
  title: { fontSize: 22, fontWeight: "700", marginVertical: 15, color: "#16A085" },
  buttonWrapper: { paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  tagline: { textAlign: "center", fontSize: 13, color: "#4D4D4D", opacity: 0.8, fontStyle: "italic" },
  glassButton: { paddingVertical: 12, borderRadius: 22, backgroundColor: "rgba(255, 255, 255, 0.9)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.3)", alignItems: "center", marginTop: 8, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6 },
  glassButtonText: { color: "#1ABC9C", fontSize: 16, fontWeight: "700" },
  card: { flexDirection: "row", backgroundColor: "#ffffff", borderRadius: 14, marginBottom: 14, elevation: 6, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6 },
  imageContainer: { width: 110, height: 110, borderTopLeftRadius: 14, borderBottomLeftRadius: 14, overflow: 'hidden' },
  foodImage: { width: '100%', height: '100%', borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  placeholder: { width: '100%', height: '100%', backgroundColor: "#ecf0f1", alignItems: "center", justifyContent: "center", borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  placeholderText: { color: "#7f8c8d", marginTop: 8, fontSize: 12 },
  cardBody: { flex: 1, padding: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  foodType: { fontSize: 17, fontWeight: "700" },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 50 },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  availableBG: { backgroundColor: "#3BB273" },
  acceptedBG: { backgroundColor: "#3498DB" },
  cancelledBG: { backgroundColor: "#E74C3C" },
  info: { fontSize: 13, marginBottom: 2, color: "#555" },
  cancelButton: { backgroundColor: "#E74C3C", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginTop: 8 },
  cancelButtonText: { color: "#fff", fontWeight: "600", fontSize: 12, textAlign: "center" },
});

export default DonateScreen;