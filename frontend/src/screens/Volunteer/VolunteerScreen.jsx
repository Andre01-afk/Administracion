import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { donationService } from '../../services/apiService';
import DonationCard from './components/DonationCard';
import DonationDetails from './components/DonationDetails';
import FilterSection from './components/FilterSection';
import DashboardTabs from './components/DashboardTabs';
import MyTaskCard from './components/MyTaskCard';

const VolunteerScreen = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [foodType, setFoodType] = useState('all');
  const [packaging, setPackaging] = useState('all');

  // Load donations from API on mount
  useEffect(() => {
    loadDonations();
    loadAcceptedTasks();
  }, []);

  // Reload tasks when screen is focused (e.g., after logout and login)
  useFocusEffect(
    React.useCallback(() => {
      loadAcceptedTasks();
      return () => {};
    }, [])
  );

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getDonations({ status: 'available' });
      setAvailableDonations(data || []);
    } catch (error) {
      console.error('Error loading donations:', error);
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

  const loadAcceptedTasks = async () => {
    try{
      const data = await donationService.getDonations({ myTasks: 'true' });
      setAcceptedDonations(data || []);
    }catch(error){
      console.error('Error cargando mis tareas:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar tus tareas',
        duration: 2000,
      });
    }
  }


  // Filter available donations by search
  const filteredDonations = availableDonations
    .filter(donation => {
      const matchesSearch = donation.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.foodType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFoodType = foodType === 'all' || donation.foodType === foodType;
      return matchesSearch && matchesFoodType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'earliest':
          return new Date(a.preferredPickupTime || 0) - new Date(b.preferredPickupTime || 0);
        case 'suggested':
          if (a.suggestedVolunteerId === currentUser?.id) return -1;
          if (b.suggestedVolunteerId === currentUser?.id) return 1;
          return 0;
      }
    });

  const handleAcceptDonation = async (donation) => {
    try {
      setLoading(true);
      await donationService.acceptDonation(donation.id);
      
      // Recargar datos desde el servidor
      await loadDonations();
      await loadAcceptedTasks();
      
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Donación aceptada correctamente',
        duration: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo aceptar la donación',
        duration: 2000,
      });
      console.error('Error accepting donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async (donationId) => {
    try {
      setLoading(true);
      await donationService.completeDonation(donationId);
      
      // Recargar datos desde el servidor
      await loadAcceptedTasks();
      
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Donación completada correctamente',
        duration: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'No se pudo completar la donación',
        duration: 2000,
      });
      console.error('Error completing donation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ShareMeal</Text>
        <Text style={styles.headerSubtitle}>Dashboard Voluntario</Text>
      </View>

      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tasksCount={acceptedDonations.length}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1ABC9C" />
          </View>
        ) : activeTab === 0 ? (
          <>
            <FilterSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              sortMenuVisible={sortMenuVisible}
              setSortMenuVisible={setSortMenuVisible}
            />

            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onAccept={() => handleAcceptDonation(donation)}
                  onPress={() => setSelectedDonation(donation)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No se han encontrado donaciones</Text>
                <Text style={styles.emptyStateSubtext}>Intenta ajustar tus filtros</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {acceptedDonations.length > 0 ? (
              acceptedDonations.map((donation) => (
                <MyTaskCard
                  key={donation.id}
                  donation={donation}
                  onComplete={handleCompleteDonation}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tienes tareas activas</Text>
                <Text style={styles.emptyStateSubtext}>Acepta donaciones para verlas aquí</Text>
                <Button
                  mode="contained"
                  onPress={() => setActiveTab(0)}
                  style={{ marginTop: 16 }}
                >
                  Encontrar Donaciones
                </Button>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <DonationDetails
        visible={!!selectedDonation}
        onDismiss={() => setSelectedDonation(null)}
        donation={selectedDonation}
        onAccept={handleAcceptDonation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1ABC9C',
    padding: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
    maxWidth: 1000,
    marginHorizontal: 'auto',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 48,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VolunteerScreen;
