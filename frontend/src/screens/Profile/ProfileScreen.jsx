import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { userService, donorService, volunteerService } from '../../services/apiService';

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Cargar datos del usuario
            const userData = await userService.getProfile();
            setProfileData(userData);
        } catch (err) {
            console.error('Error loading profile:', err);
            setError(err.message);
            // Fallback al usuario del auth context
            setProfileData(user || {
                name: 'Usuario',
                email: user?.email || 'email@example.com',
                phone: '+1 234 567 8900',
            });
        } finally {
            setLoading(false);
        }
    };

    // Use loaded profile data, fallback to auth user
    const displayData = profileData || user || {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        location: 'New York, USA',
    };

    const handleLogout = async () => {
        Toast.show({
            type: 'info',
            text1: 'Cerrando sesión...',
            duration: 2000,
        });
        await logout();
        Toast.show({
            type: 'success',
            text1: 'Sesión cerrada',
            text2: 'Has cerrado sesión correctamente',
            duration: 2000,
        });
    };

    const handleEditProfile = () => {
        Toast.show({
            type: 'info',
            text1: 'Próximamente',
            text2: 'La funcionalidad de edición se agregará pronto',
            duration: 2000,
        });
    };

    const handleSettings = () => {
        Toast.show({
            type: 'info',
            text1: 'Próximamente',
            text2: 'La página de configuración se agregará pronto',
            duration: 2000,
        });
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1ABC9C" />
                        <Text style={styles.loadingText}>Cargando perfil...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.header}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {displayData.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.name}>{displayData.name}</Text>
                            <Text style={styles.email}>{displayData.email}</Text>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Información de Contacto</Text>
                            
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{displayData.email}</Text>
                            </View>
                            
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Teléfono</Text>
                                <Text style={styles.infoValue}>{displayData.phone || 'No disponible'}</Text>
                            </View>
                            
                            {displayData.location && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Ubicación</Text>
                                    <Text style={styles.infoValue}>{displayData.location}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity 
                                style={styles.editButton}
                                onPress={handleEditProfile}
                            >
                                <Text style={styles.editButtonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.settingsButton}
                                onPress={handleSettings}
                            >
                                <Text style={styles.settingsButtonText}>Configuración</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.logoutButton} 
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 64,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1ABC9C',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    statCard: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1ABC9C',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoSection: {
        padding: 20,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    actionsContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    editButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    settingsButton: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1ABC9C',
    },
    settingsButtonText: {
        color: '#1ABC9C',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;
