import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button, Avatar, useTheme } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getFirstValidPhoto, isValidImageUrl } from '../../../utils/imageUtils';

const DonationCard = ({ donation, onAccept, onPress, isAccepted = false, currentUserId }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  
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
    suggestedVolunteerId,
  } = donation;

  // Calcular fecha/hora
  const formatDateTime = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const photoUrl = getFirstValidPhoto(photos);
  const hasValidPhoto = photoUrl && isValidImageUrl(photoUrl) && !imageError;

  return (
    <Card style={styles.card} onPress={onPress}>
      
      {suggestedVolunteerId === currentUserId && (
        <View style={styles.suggestedBadge}>
            <MaterialIcons name="star" size={14} color="#fff" />
            <Text style={styles.suggestedText}>⭐ Recomendado para ti</Text>
        </View>
    )}
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {hasValidPhoto ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.foodImage}
              resizeMode="cover"
              onError={() => {
                console.warn('Image failed to load:', photoUrl?.substring(0, 50));
                setImageError(true);
              }}
              onLoad={() => console.log('Image loaded successfully')}
            />
          ) : (
            <View style={styles.placeholderIcon}>
              <MaterialIcons name="fastfood" size={40} color="#9e9e9e" />
            </View>
          )
        }</View>

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <View style={styles.foodInfo}>
              <Text style={styles.foodType}>{foodType}</Text>

              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.infoText}>{area}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="access-time" size={16} color="#666" />
                <Text style={styles.infoText}>{formatDateTime(preferredPickupTime)}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialIcons name="home" size={16} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>{pickupAddress}</Text>
              </View>
            </View>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>{approxQuantity}</Text>
              <Text style={styles.mealsText}>{quantityUnit}</Text>
            </View>
          </View>

          {donor && (
            <Text style={styles.donorText}>
              Por: {donor.name}
            </Text>
          )}
        </View>
      </View>

      <Card.Actions style={styles.cardActions}>
        <Button
          mode="contained"
          onPress={onAccept}
          disabled={isAccepted}
          style={[
            styles.actionButton,
            isAccepted && { backgroundColor: theme.colors.secondary }
          ]}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
        >
          {isAccepted ? 'Aceptado' : 'Aceptar Donación'}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 16,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodInfo: {
    flex: 1,
    marginRight: 8,
  },
  foodType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  quantityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9f6',
    borderRadius: 8,
    padding: 8,
    height: 70,
    minWidth: 70,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1ABC9C',
  },
  mealsText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
  },
  donorText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  cardActions: {
    padding: 12,
    paddingTop: 0,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#1ABC9C',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    paddingVertical: 2,
  },
  buttonContent: {
    height: 44,
  },
  suggestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1ABC9C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 4,
  },
  suggestedText:{
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DonationCard;
