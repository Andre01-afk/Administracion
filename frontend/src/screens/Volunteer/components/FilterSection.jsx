import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Searchbar, Button, Menu, Text, Chip } from 'react-native-paper';

const FilterSection = ({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    foodType,
    setFoodType,
    packaging,
    setPackaging,
    showFilters,
    setShowFilters,
    sortMenuVisible,
    setSortMenuVisible
}) => {
    return (
        <View style={styles.filterSection}>
            <View style={styles.searchRow}>
                <Searchbar
                    placeholder="Buscar zona o comida..."
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
                    <Menu.Item onPress={() => { setSortBy('nearest'); setSortMenuVisible(false); }} title="Más Cercano" />
                    <Menu.Item onPress={() => { setSortBy('earliest'); setSortMenuVisible(false); }} title="Primer Recogida" />
                    <Menu.Item onPress={() => { setSortBy('newest'); setSortMenuVisible(false); }} title="Más Nuevo" />
                </Menu>
            </View>

            <Button
                mode="text"
                onPress={() => setShowFilters(!showFilters)}
                icon={showFilters ? "chevron-up" : "filter-variant"}
                style={styles.filterToggle}
            >
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>

            {showFilters && (
                <View style={styles.advancedFilters}>
                    <Text style={styles.filterLabel}>Tipo de comida:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        <Chip
                            selected={foodType === 'all'}
                            onPress={() => setFoodType('all')}
                            style={styles.filterChip}
                        >All</Chip>
                        <Chip
                            selected={foodType === 'veg'}
                            onPress={() => setFoodType('veg')}
                            style={styles.filterChip}
                        >Veg</Chip>
                        <Chip
                            selected={foodType === 'non-veg'}
                            onPress={() => setFoodType('non-veg')}
                            style={styles.filterChip}
                        >Non-Veg</Chip>
                    </ScrollView>

                    <Text style={styles.filterLabel}>Packaging:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                        <Chip
                            selected={packaging === 'all'}
                            onPress={() => setPackaging('all')}
                            style={styles.filterChip}
                        >All</Chip>
                        <Chip
                            selected={packaging === 'packaged'}
                            onPress={() => setPackaging('packaged')}
                            style={styles.filterChip}
                        >Packaged</Chip>
                        <Chip
                            selected={packaging === 'fresh'}
                            onPress={() => setPackaging('fresh')}
                            style={styles.filterChip}
                        >Fresh</Chip>
                    </ScrollView>
                </View>
            )}
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
        marginBottom: 8,
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
    filterToggle: {
        alignSelf: 'flex-end',
    },
    advancedFilters: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 8,
    },
    chipScroll: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    filterChip: {
        marginRight: 8,
    },
});

export default FilterSection;
