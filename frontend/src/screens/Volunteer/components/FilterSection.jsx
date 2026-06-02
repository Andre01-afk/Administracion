import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Button, Menu } from 'react-native-paper';

const FilterSection = ({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortMenuVisible,
    setSortMenuVisible
}) => {
    return (
        <View style={styles.filterSection}>
            <View style={styles.searchRow}>
                <Searchbar
                    placeholder="Buscar plato o zona (Ej: Pizza)..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                />
                <Menu
                    visible={sortMenuVisible}
                    onDismiss={() => setSortMenuVisible(false)}
                    anchor={
                        <Button
                            mode="outlined"
                            onPress={() => setSortMenuVisible(true)}
                            style={styles.sortButton}
                            icon="sort"
                        >
                            Ordenar
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => { setSortBy('suggested'); setSortMenuVisible(false); }} title="Sugerido" />
                    <Menu.Item onPress={() => { setSortBy('earliest'); setSortMenuVisible(false); }} title="Más Urgente" />
                    <Menu.Item onPress={() => { setSortBy('newest'); setSortMenuVisible(false); }} title="Más Nuevo" />
                </Menu>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    filterSection: {
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        marginRight: 8,
        elevation: 2,
        backgroundColor: 'white',
    },
    searchInput: {
        fontSize: 14,
    },
    sortButton: {
        height: 48,
        justifyContent: 'center',
    },
});

export default FilterSection;