import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/apiService';

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    
    //Estados principales
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    //Estados para Edición
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: ''});
    
    //Estados para Configuración
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            const userData = await userService.getProfile();
            setProfileData(userData);
        } catch (err) {
            console.error('Error loading profile:', err);
            // Fallback al usuario del auth context
            setProfileData(user || {
                name: 'Usuario',
                email: user?.email || 'email@example.com',
                phone: ''
            });
        } finally {
            setLoading(false);
        }
    };

    const displayData = profileData || user || {
        name: 'Usuario',
        email: 'email@example.com',
        phone: '',
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditForm({
                name: displayData.name || '',
                phone: displayData.phone || '',
            });
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            await userService.updateProfile(editForm);
            
            // Actualizamos la pantalla con los nuevos datos
            setProfileData({ ...displayData, ...editForm });
            setIsEditing(false);
            
            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Perfil actualizado correctamente',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo actualizar el perfil',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Toast.show({ type: 'info', text1: 'Cerrando sesión...' });
        await logout();
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
                                        {displayData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.name}>{displayData.name}</Text>
                            <Text style={styles.email}>{displayData.email}</Text>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Información de Contacto</Text>
                            
                            {isEditing && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Nombre</Text>
                                    <TextInput 
                                        style={styles.input}
                                        value={editForm.name}
                                        onChangeText={(text) => setEditForm({...editForm, name: text})}
                                        placeholder="Tu nombre completo"
                                    />
                                </View>
                            )}

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{displayData.email}</Text>
                            </View>
                            
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Teléfono</Text>
                                {isEditing ? (
                                    <TextInput 
                                        style={styles.input}
                                        value={editForm.phone}
                                        onChangeText={(text) => setEditForm({...editForm, phone: text})}
                                        placeholder="Ej: 987654321"
                                        keyboardType="phone-pad"
                                    />
                                ) : (
                                    <Text style={styles.infoValue}>{displayData.phone || 'No disponible'}</Text>
                                )}
                            </View>
                        </View>

                        {!isEditing && (
                            <View style={styles.infoSection}>
                                <Text style={styles.sectionTitle}>Configuración</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Notificaciones Push</Text>
                                    <Switch 
                                        value={notificationsEnabled}
                                        onValueChange={setNotificationsEnabled}
                                        trackColor={{ false: "#767577", true: "#1ABC9C" }}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.actionsContainer}>
                            {isEditing ? (
                                <>
                                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                                        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={handleEditToggle}>
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
                                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollView: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 64 },
    loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
    header: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20, backgroundColor: '#1ABC9C', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
    avatarContainer: { marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
    avatarText: { fontSize: 36, fontWeight: 'bold', color: '#1ABC9C' },
    name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    email: { fontSize: 14, color: '#e0e0e0' },
    infoSection: { padding: 20, backgroundColor: '#fff', marginHorizontal: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    infoLabel: { fontSize: 14, color: '#666', fontWeight: '500', flex: 1 },
    infoValue: { fontSize: 14, color: '#333', flex: 2, textAlign: 'right' },
    input: { flex: 2, textAlign: 'right', borderBottomWidth: 1, borderBottomColor: '#1ABC9C', paddingVertical: 0, fontSize: 14, color: '#333' },
    actionsContainer: { padding: 20, paddingBottom: 40 },
    editButton: { backgroundColor: '#fff', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1ABC9C' },
    editButtonText: { color: '#1ABC9C', fontSize: 16, fontWeight: '600' },
    saveButton: { backgroundColor: '#1ABC9C', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    cancelButton: { backgroundColor: '#f0f0f0', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    cancelButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
    logoutButton: { backgroundColor: '#f44336', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12, elevation: 2 },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;