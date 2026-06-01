import React, { useState, useEffect } from "react";
import {View,Text,StyleSheet,FlatList,TouchableOpacity,Image,ActivityIndicator,Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { donationService } from "../../services/apiService";
import { MaterialIcons } from "@expo/vector-icons";
import { getFirstValidPhoto, isValidImageUrl } from "../../utils/imageUtils";

const DonateScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      // Obtener solo las donaciones del usuario logueado
      const data = await donationService.getDonations({ donorId: user?.id });
      setDonations(data);
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

  const handleCancel = async (id) => {
    try {
      // Esta función dependerá de si tienes endpoint para cancelar
      // Por ahora solo mostramos un mensaje
      Toast.show({
        type: 'info',
        text1: 'Próximamente',
        text2: 'La funcionalidad de cancelación se agregará pronto',
        duration: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo cancelar la donación',
        duration: 2000,
      });
    }
  };

  const handleImageError = (donationId) => {
    setImageErrors(prev => ({
      ...prev,
      [donationId]: true
    }));
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
              onError={() => {
                console.warn('Image failed to load in donate screen:', photoUrl?.substring(0, 50));
                handleImageError(item.id);
              }}
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
                item.status === "available"
                  ? styles.availableBG
                  : item.status === "accepted"
                  ? styles.acceptedBG
                  : styles.cancelledBG,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.info}>Cantidad: {item.approxQuantity} {item.quantityUnit}</Text>
          <Text style={styles.info}>
            Zona: {item.area}
          </Text>
          <Text style={styles.info}>
            Dirección: {item.pickupAddress}
          </Text>

          {item.preferredPickupTime && (
            <Text style={styles.info}>Recogida: {new Date(item.preferredPickupTime).toLocaleString()}</Text>
          )}

          {item.donor && (
            <Text style={styles.info}>Donante: {item.donor.name}</Text>
          )}

          {item.contactNumber && (
            <Text style={styles.info}>Contacto: {item.contactNumber}</Text>
          )}

          {item.status !== "cancelled" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item.id)}
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

        <TouchableOpacity
          onPress={() => navigation.navigate("CreateDonationForm")}
          activeOpacity={0.7}
        >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    backgroundColor: "#1ABC9C",
    padding: 22,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "white" },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    marginTop: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 15,
    color: "#16A085",
  },

  buttonWrapper: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  tagline: {
    textAlign: "center",
    fontSize: 13,
    color: "#4D4D4D",
    opacity: 0.8,
    fontStyle: "italic",
  },
  glassButton: {
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  glassButtonText: {
    color: "#1ABC9C",
    fontSize: 16,
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  imageContainer: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    overflow: 'hidden',
  },

  foodImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: "#ecf0f1",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  placeholderText: { color: "#7f8c8d", marginTop: 8, fontSize: 12 },

  cardBody: { flex: 1, padding: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  foodType: { fontSize: 17, fontWeight: "700" },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "600" },

  availableBG: { backgroundColor: "#3BB273" },
  acceptedBG: { backgroundColor: "#3498DB" },
  cancelledBG: { backgroundColor: "#E74C3C" },

  info: { fontSize: 13, marginBottom: 2, color: "#555" },
  notes: { fontSize: 12, marginTop: 4, fontStyle: "italic", color: "#777" },

  cancelButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});

export default DonateScreen;
