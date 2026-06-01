import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreen from './src/screens/Splash/SplashScreen.jsx';
import LoginScreen from './src/screens/Login/LoginScreen.jsx';
import RegisterScreen from './src/screens/Register/RegisterScreen.jsx';
import TabNavigator from './src/navigation/TabNavigator';
import CreateDonationForm from './src/screens/Donate/CreateDonationForm.jsx';

// Configure the theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1ABC9C', // Teal
    accent: '#16A085', // Green-Blue
    background: '#FFFFFF', // White
    surface: '#FFFFFF', // White
    text: '#0E0E0E', // Rich Black
    error: '#f44336',
    disabled: '#CCCCCC', // Gray
    placeholder: '#CCCCCC', // Gray
    // Custom colors
    secondary: '#2980B9', // Royal Blue
    softBlue: '#AEDFF7',
    richBlack: '#0E0E0E',
    gray: '#CCCCCC',
  },
  roundness: 8,
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        {isAuthenticated ? (
          // Authenticated stack
          <>
            <Stack.Screen name="Main" component={TabNavigator} options={{ animationEnabled: false }} />
            <Stack.Screen name="CreateDonationForm" component={CreateDonationForm} />
          </>
        ) : (
          // Unauthenticated stack
          <>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ animationEnabled: false }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <AuthProvider>
          <AppNavigator />
          <Toast />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
