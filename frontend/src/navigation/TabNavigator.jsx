import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import DonateScreen from '../screens/Donate/DonateScreen';
import VolunteerScreen from '../screens/Volunteer/VolunteerScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const isDonor = user?.role === 'donor';
    const isVolunteer = user?.role === 'volunteer';

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 8,
                    paddingTop: 8,
                    elevation: 8,
                    backgroundColor: 'white',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: insets.bottom > 0 ? 0 : 4,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            
            {/* Tab solo para DONANTES */}
            {isDonor && (
                <Tab.Screen
                    name="Donate"
                    component={DonateScreen}
                    options={{
                        tabBarLabel: 'Mis Donaciones',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="favorite" size={size} color={color} />
                        ),
                    }}
                />
            )}

            {/* Tab solo para VOLUNTARIOS */}
            {isVolunteer && (
                <Tab.Screen
                    name="Volunteer"
                    component={VolunteerScreen}
                    options={{
                        tabBarLabel: 'Disponibles',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="volunteer-activism" size={size} color={color} />
                        ),
                    }}
                />
            )}

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
