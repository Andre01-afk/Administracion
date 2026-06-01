import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const DashboardTabs = ({ activeTab, setActiveTab, tasksCount }) => {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 0 && styles.activeTab]}
                onPress={() => setActiveTab(0)}
            >
                <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Disponibles</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 1 && styles.activeTab]}
                onPress={() => setActiveTab(1)}
            >
                <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
                    Mis Tareas {tasksCount > 0 && `(${tasksCount})`}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#1ABC9C',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#1ABC9C',
        fontWeight: 'bold',
    },
});

export default DashboardTabs;
