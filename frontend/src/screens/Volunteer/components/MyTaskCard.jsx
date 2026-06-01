import React, { useState } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirstValidPhoto, isValidImageUrl } from '../../../utils/imageUtils';

const MyTaskCard = ({ donation, onComplete }) => {
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
    const donorPhone = donor?.phone;

    const handleDirections = () => {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickupAddress)}`;
        Linking.openURL(mapsUrl);
    };

    return (
        <Surface style={styles.taskCard} elevation={2}>
            <View style={styles.taskImageContainer}>
                {hasValidPhoto ? (
                    <Image 
                        source={{ uri: photoUrl }} 
                        style={styles.taskImage}
                        onError={() => {
                            console.warn('Image failed to load in task:', photoUrl?.substring(0, 50));
                            setImageError(true);
                        }}
                    />
                ) : (
                    <View style={[styles.taskImage, styles.placeholderImage]}>
                        <MaterialIcons name="fastfood" size={40} color="#9e9e9e" />
                    </View>
                )}
            </View>

            <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{foodType}</Text>

                <View style={styles.taskInfoRow}>
                    <MaterialIcons name="location-on" size={16} color="#1ABC9C" />
                    <Text style={styles.taskInfoText}>{area}</Text>
                </View>

                <View style={styles.taskInfoRow}>
                    <MaterialIcons name="access-time" size={16} color="#1ABC9C" />
                    <Text style={styles.taskInfoText}>{formatDateTime(preferredPickupTime)}</Text>
                </View>

                <View style={styles.taskInfoRow}>
                    <MaterialIcons name="inventory" size={16} color="#1ABC9C" />
                    <Text style={styles.taskInfoText}>{approxQuantity} {quantityUnit}</Text>
                </View>

                {donorPhone && (
                    <View style={styles.taskInfoRow}>
                        <MaterialIcons name="phone" size={16} color="#1ABC9C" />
                        <Text style={styles.taskInfoText}>{donorPhone}</Text>
                    </View>
                )}

                <View style={styles.taskActions}>
                    <Button
                        mode="outlined"
                        compact
                        icon="directions"
                        onPress={handleDirections}
                        style={styles.taskButton}
                    >
                        Direcciones
                    </Button>
                    <Button
                        mode="contained"
                        compact
                        onPress={() => onComplete(id)}
                        style={styles.taskButton}
                    >
                        Completar
                    </Button>
                </View>
            </View>
        </Surface>
    );
};

const styles = StyleSheet.create({
    taskCard: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    taskImageContainer: {
        height: 150,
        width: '100%',
    },
    taskImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskContent: {
        padding: 16,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    taskInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    taskInfoText: {
        marginLeft: 8,
        color: '#666',
    },
    taskActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 8,
    },
    taskButton: {
        flex: 1,
    },
});

export default MyTaskCard;
