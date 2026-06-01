import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState(null); 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !role) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor completa todos los campos requeridos',
                duration: 2000,
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Las contraseñas no coinciden',
                duration: 2000,
            });
            return;
        }

        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'La contraseña debe tener al menos 6 caracteres',
                duration: 2000,
            });
            return;
        }

        setLoading(true);
        try {
            const result = await register(name, email, password, phone, role);
            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Registro exitoso',
                    text2: 'Tu cuenta ha sido creada correctamente',
                    duration: 2000,
                });
                // La navegación es automática porque isAuthenticated cambió en App.js
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error de Registro',
                    text2: result.error || 'No se pudo crear la cuenta',
                    duration: 2000,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Ocurrió un error durante el registro',
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>ShareMeal</Text>
                            <Text style={styles.subtitle}>Create Account</Text>
                            <Text style={styles.description}>Sign up to get started</Text>
                        </View>

                        <View style={styles.form}>
                            <TextInput
                                label="Full Name *"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                autoCapitalize="words"
                                style={styles.input}
                                theme={{ colors: { primary: '#1ABC9C' } }}
                            />

                            <TextInput
                                label="Email *"
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                style={styles.input}
                                theme={{ colors: { primary: '#1ABC9C' } }}
                            />

                            <TextInput
                                label="Phone"
                                value={phone}
                                onChangeText={setPhone}
                                mode="outlined"
                                keyboardType="phone-pad"
                                style={styles.input}
                                theme={{ colors: { primary: '#1ABC9C' } }}
                            />

                            <View style={styles.roleSection}>
                                <Text style={styles.roleLabel}>¿Cuál es tu rol? *</Text>
                                <View style={styles.roleButtons}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.roleButton,
                                            role === 'donor' && styles.roleButtonActive
                                        ]}
                                        onPress={() => setRole('donor')}
                                    >
                                        <Text style={[
                                            styles.roleButtonText,
                                            role === 'donor' && styles.roleButtonTextActive
                                        ]}>
                                            🍽️ Donante
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        style={[
                                            styles.roleButton,
                                            role === 'volunteer' && styles.roleButtonActive
                                        ]}
                                        onPress={() => setRole('volunteer')}
                                    >
                                        <Text style={[
                                            styles.roleButtonText,
                                            role === 'volunteer' && styles.roleButtonTextActive
                                        ]}>
                                            🤝 Voluntario
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TextInput
                                label="Password *"
                                value={password}
                                onChangeText={setPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                style={styles.input}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                                theme={{ colors: { primary: '#1ABC9C' } }}
                            />

                            <TextInput
                                label="Confirm Password *"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                mode="outlined"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                style={styles.input}
                                right={
                                    <TextInput.Icon
                                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                }
                                theme={{ colors: { primary: '#1ABC9C' } }}
                            />

                            <TouchableOpacity
                                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                <Text style={styles.registerButtonText}>
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.footerLink}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1ABC9C',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    roleSection: {
        marginBottom: 16,
    },
    roleLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    roleButtonActive: {
        borderColor: '#1ABC9C',
        backgroundColor: '#e8f8f6',
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    roleButtonTextActive: {
        color: '#1ABC9C',
    },
    registerButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    footerLink: {
        fontSize: 14,
        color: '#1ABC9C',
        fontWeight: '600',
    },
});

export default RegisterScreen;

