import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import {
  Text,
  Button,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  Divider,
  Surface
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirstValidPhoto, isValidImageUrl } from '../../../utils/imageUtils';

const DonationDetails = ({ visible, onDismiss, donation, onAccept }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  if (!donation) return null;

  // Destructure datos reales del backend
  const {
    id,
    foodType,
    approxQuantity,
    quantityUnit = 'portions',
    area,
    pickupAddress,
    preferredPickupTime,
    contactNumber,
    photos,
    donor,
    status,
  } = donation;

  // Calcular fecha/hora
  const formatDateTime = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const photoUrl = getFirstValidPhoto(photos);
  const hasValidPhoto = photoUrl && isValidImageUrl(photoUrl) && !imageError;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(pickupAddress)}`;
    Linking.openURL(url).catch(err => console.error('Error opening maps:', err));
  };

  const handleCall = () => {
    if (contactNumber) {
      Linking.openURL(`tel:${contactNumber}`).catch(err => console.error('Error calling:', err));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detalles de Donación</Text>
          <IconButton icon="close" onPress={onDismiss} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.imageContainer}>
            {hasValidPhoto ? (
              <Image
                source={{ uri: photoUrl }}
                style={styles.image}
                resizeMode="cover"
                onError={() => {
                  console.warn('Image failed to load in details:', photoUrl?.substring(0, 50));
                  setImageError(true);
                }}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="fastfood" size={60} color="#9e9e9e" />
              </View>
            )}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{foodType}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cantidad</Text>
              <Text style={styles.sectionContent}>{approxQuantity} {quantityUnit}</Text>
            </View>

            <View style={styles.chipContainer}>
              <Chip mode="outlined" style={styles.chip}>
                {status === 'available' ? '✓ Disponible' : status}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>DETALLES DE RECOGIDA</Text>

            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color="#1ABC9C" />
              <Text style={styles.infoText}>{pickupAddress}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="access-time" size={20} color="#1ABC9C" />
              <Text style={styles.infoText}>{formatDateTime(preferredPickupTime)}</Text>
            </View>

            {donor && (
              <>
                <View style={styles.infoRow}>
                  <Avatar.Text
                    size={24}
                    label={donor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    style={styles.avatar}
                  />
                  <Text style={styles.infoText}>{donor.name}</Text>
                </View>

                {donor.phone && (
                  <View style={styles.infoRow}>
                    <MaterialIcons name="phone" size={20} color="#1ABC9C" />
                    <Text style={styles.infoText}>{donor.phone}</Text>
                  </View>
                )}
              </>
            )}

            {contactNumber && (
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={20} color="#1ABC9C" />
                <Text style={styles.infoText}>Contacto: {contactNumber}</Text>
              </View>
            )}

            <View style={styles.mealsEstimate}>
              <Text style={styles.mealsText}>
                Ubicación: <Text style={styles.mealsValue}>{area}</Text>
              </Text>

              <Button
                mode="outlined"
                icon="directions"
                onPress={handleDirections}
              >
                Direcciones
              </Button>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={() => {
              onAccept(donation);
              onDismiss();
            }}
            style={styles.acceptButton}
            contentStyle={{ height: 48 }}
          >
            Aceptar Donación
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  avatar: {
    backgroundColor: '#1ABC9C',
  },
  instructionSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 15,
    color: '#333',
  },
  mealsEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  mealsText: {
    fontSize: 16,
    color: '#666',
  },
  mealsValue: {
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  acceptButton: {
    borderRadius: 12,
    backgroundColor: '#1ABC9C',
  },
});

export default DonationDetails;
