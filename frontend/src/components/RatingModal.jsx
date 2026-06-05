import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, Button, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const RatingModal = ({ visible, onDismiss, donation, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRate = async () => {
    if (rating === 0) {
      Toast.show({
        type: 'error',
        text1: 'Calificación requerida',
        text2: 'Por favor, selecciona al menos 1 estrella.',
        position: 'top'
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmitRating({
        donationId: donation.id,
        rating: rating,
        comment: comment
      });

      Toast.show({
        type: 'success',
        text1: '¡Gracias por tu retroalimentación!',
        text2: 'Tu calificación ayuda a mejorar nuestra comunidad.',
        position: 'top'
      });
      
      setRating(0);
      setComment('');
      onDismiss();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema al enviar tu calificación.',
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss} 
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.title}>Califica la Entrega</Text>
        <Text style={styles.subtitle}>
          ¿Qué tal fue tu experiencia con el voluntario?
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <MaterialIcons
                name={star <= rating ? "star" : "star-border"}
                size={48}
                color={star <= rating ? "#F1C40F" : "#BDC3C7"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          mode="outlined"
          label="Comentario (Opcional)"
          placeholder="Ej: Llegó muy puntual"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={3}
          style={styles.input}
          activeOutlineColor="#1ABC9C"
        />

        <View style={styles.buttonContainer}>
          <Button 
            mode="text" 
            onPress={onDismiss} 
            textColor="#7F8C8D"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            mode="contained" 
            onPress={handleRate}
            loading={loading}
            buttonColor="#1ABC9C"
            style={styles.submitButton}
          >
            Enviar Calificación
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    maxWidth: 450, 
    width: '90%',
    alignSelf: 'center', 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12, 
  },
  submitButton: {
    borderRadius: 8,
  }
});

export default RatingModal;