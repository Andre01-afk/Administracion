import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    Text,
    Card,
    useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import local images
import food1 from '../../../assets/food1.jpg';
import food2 from '../../../assets/fooddonate.jpg';
import food3 from '../../../assets/schoolmeal.jpg';
import splashImage from '../../../assets/splashImage.png';
import formImage from '../../../assets/form.jpg';
import form2 from '../../../assets/donation.jpg';
import form3 from '../../../assets/give food.jpg';
import communityImage from '../../../assets/community.jpg';

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();

    // Mock data - in production, fetch from API
    const [stats, setStats] = useState({
        totalMealsServed: 1247,
        activeDonations: 12,
        completedDonations: 89,
        totalVolunteers: 156,
        communitiesServed: 24,
    });

    const howItWorks = [
        {
            id: 1,
            step: '1',
            title: 'Donate Food',
            description: 'Share your excess food with those in need',
            icon: 'restaurant',
            image: food2,
        },
        {
            id: 2,
            step: '2',
            title: 'Volunteers Pick Up',
            description: 'Our volunteers collect and verify the food',
            icon: 'local-shipping',
            image: form2,
        },
        {
            id: 3,
            step: '3',
            title: 'Deliver to Community',
            description: 'Food is safely delivered to those who need it',
            icon: 'people',
            image: form3,
        },
    ];

    const impactStories = [
        {
            id: 1,
            title: 'Community Kitchen Initiative',
            description: 'Serving 500+ meals daily to families in need',
            image: communityImage,
            location: 'Mumbai Central',
        },
        {
            id: 2,
            title: 'School Meal Program',
            description: 'Providing nutritious meals to 200+ children',
            image: food3,
            location: 'Bandra West',
        },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos Dias';
        if (hour < 17) return 'Buenas Tardes';
        return 'Buenas Noches';
    };

    const StatCard = ({ icon, label, value, color }) => (
        <Card style={[styles.statCard, { backgroundColor: color }]}>
            <Card.Content style={styles.statCardContent}>
                <View style={styles.statIconContainer}>
                    <MaterialIcons name={icon} size={28} color="white" />
                </View>
                <View style={styles.statTextContainer}>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statLabel}>{label}</Text>
                </View>
            </Card.Content>
        </Card>
    );

    const QuickActionButton = ({ icon, label, onPress, color, image }) => (
        <TouchableOpacity
            style={[styles.quickActionButton, { borderColor: color }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {image && (
                <Image
                    source={image}
                    style={styles.quickActionBackground}
                    resizeMode="cover"
                />
            )}
            <View style={[styles.quickActionGradient, { backgroundColor: color }]}>
                <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
                    <MaterialIcons name={icon} size={24} color="white" />
                </View>
                <Text style={styles.quickActionLabel}>{label}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section with Image */}
                <View style={styles.headerContainer}>
                    <Image
                        source={splashImage}
                        style={styles.headerBackgroundImage}
                        resizeMode="cover"
                    />
                    <View style={styles.headerOverlay}>
                        <View style={styles.headerContent}>
                            <Text style={styles.greeting}>{getGreeting()}!</Text>
                            <Text style={styles.welcomeText}>Bienvenido a ShareMeal</Text>
                            <Text style={styles.tagline}>
                                Juntos, podemos luchar contra el hambre un plato a la vez
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Statistics Section */}
                <View style={styles.statsContainer}>
                    <StatCard
                        icon="restaurant"
                        label="Comidas Servidas"
                        value={stats.totalMealsServed.toLocaleString()}
                        color="#3498DB"
                    />
                    <StatCard
                        icon="favorite"
                        label="Active Donations"
                        value={stats.activeDonations}
                        color="#E74C3C"
                    />
                    <StatCard
                        icon="check-circle"
                        label="Completed"
                        value={stats.completedDonations}
                        color="#27AE60"
                    />
                </View>

                {/* Additional Stats Row */}
                <View style={styles.additionalStatsContainer}>
                    <View style={styles.additionalStatItem}>
                        <MaterialIcons name="people" size={24} color="#1ABC9C" />
                        <Text style={styles.additionalStatValue}>
                            {stats.totalVolunteers}
                        </Text>
                        <Text style={styles.additionalStatLabel}>Voluntarios</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.additionalStatItem}>
                        <MaterialIcons name="location-city" size={24} color="#1ABC9C" />
                        <Text style={styles.additionalStatValue}>
                            {stats.communitiesServed}
                        </Text>
                        <Text style={styles.additionalStatLabel}>Comunidades</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                    <View style={styles.quickActionsRow}>
                        <QuickActionButton
                            icon="favorite"
                            label="Donar Comida"
                            onPress={() => navigation.navigate('Donate')}
                            color="#1ABC9C"
                            image={food2}
                        />
                        <QuickActionButton
                            icon="volunteer-activism"
                            label="Ser Voluntario"
                            onPress={() => navigation.navigate('Volunteer')}
                            color="#2980B9"
                            image={food1}
                        />
                    </View>
                </View>

                {/* How It Works Section */}
                <View style={styles.howItWorksContainer}>
                    <Text style={styles.sectionTitle}>How It Works</Text>
                    <Text style={styles.sectionSubtitle}>
                        Join us in making a difference in three simple steps
                    </Text>
                    {howItWorks.map((item, index) => (
                        <Card
                            key={item.id}
                            style={[
                                styles.howItWorksCard,
                                index === howItWorks.length - 1 && styles.lastCard,
                            ]}
                        >
                            <View style={styles.howItWorksContent}>
                                <View style={styles.howItWorksImageContainer}>
                                    <Image
                                        source={item.image}
                                        style={styles.howItWorksImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.stepBadge}>
                                        <Text style={styles.stepBadgeText}>{item.step}</Text>
                                    </View>
                                </View>
                                <View style={styles.howItWorksTextContainer}>
                                    <View style={styles.howItWorksHeader}>
                                        <MaterialIcons
                                            name={item.icon}
                                            size={24}
                                            color="#1ABC9C"
                                        />
                                        <Text style={styles.howItWorksTitle}>
                                            {item.title}
                                        </Text>
                                    </View>
                                    <Text style={styles.howItWorksDescription}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Community Impact Section */}
                <View style={styles.impactStoriesContainer}>
                    <Text style={styles.sectionTitle}>Community Impact</Text>
                    <Text style={styles.sectionSubtitle}>
                        See how your donations are making a real difference
                    </Text>
                    {impactStories.map((story) => (
                        <Card
                            key={story.id}
                            style={styles.impactStoryCard}
                            onPress={() => navigation.navigate('Volunteer')}
                        >
                            <View style={styles.impactStoryWrapper}>
                                <Image
                                    source={story.image}
                                    style={styles.impactStoryImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.impactStoryOverlay} />
                                <View style={styles.impactStoryContent}>
                                    <View style={styles.impactStoryHeader}>
                                        <MaterialCommunityIcons
                                            name="hand-heart"
                                            size={20}
                                            color="white"
                                        />
                                        <Text style={styles.impactStoryLocation}>
                                            {story.location}
                                        </Text>
                                    </View>
                                    <Text style={styles.impactStoryTitle}>
                                        {story.title}
                                    </Text>
                                    <Text style={styles.impactStoryDescription}>
                                        {story.description}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Mission Statement with Image */}
                <Card style={styles.impactCard}>
                    <View style={styles.impactCardWrapper}>
                        <Image
                            source={formImage}
                            style={styles.impactBackgroundImage}
                            resizeMode="cover"
                        />
                        <View style={styles.impactGradient}>
                            <Card.Content style={styles.impactContent}>
                                <MaterialCommunityIcons
                                    name="heart-multiple"
                                    size={40}
                                    color="white"
                                    style={styles.impactIcon}
                                />
                                <Text style={styles.impactTitle}>
                                    Our Mission
                                </Text>
                                <Text style={styles.impactText}>
                                    ShareMeal connects food donors with volunteers to reduce food waste
                                    and fight hunger. Every meal shared brings us closer to a world where
                                    no one goes to bed hungry. Join our community of compassionate
                                    individuals making a real difference.
                                </Text>
                                <View style={styles.missionStats}>
                                    <View style={styles.missionStatItem}>
                                        <Text style={styles.missionStatValue}>100%</Text>
                                        <Text style={styles.missionStatLabel}>Transparent</Text>
                                    </View>
                                    <View style={styles.missionStatDivider} />
                                    <View style={styles.missionStatItem}>
                                        <Text style={styles.missionStatValue}>24/7</Text>
                                        <Text style={styles.missionStatLabel}>Available</Text>
                                    </View>
                                    <View style={styles.missionStatDivider} />
                                    <View style={styles.missionStatItem}>
                                        <Text style={styles.missionStatValue}>Free</Text>
                                        <Text style={styles.missionStatLabel}>Service</Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </View>
                    </View>
                </Card>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    headerContainer: {
        height: 220,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerBackgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(26, 188, 156, 0.85)',
    },
    headerContent: {
        padding: 24,
        paddingTop: 32,
        paddingBottom: 32,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    welcomeText: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.95)',
        marginBottom: 8,
        fontWeight: '600',
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: -20,
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statCardContent: {
        padding: 12,
    },
    statIconContainer: {
        marginBottom: 8,
    },
    statTextContainer: {
        alignItems: 'flex-start',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    additionalStatsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    additionalStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
    },
    additionalStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    additionalStatLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    quickActionsContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
    },
    quickActionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    quickActionButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 140,
    },
    quickActionBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3,
    },
    quickActionGradient: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
    },
    quickActionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    quickActionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    impactCard: {
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    impactCardWrapper: {
        position: 'relative',
        minHeight: 200,
    },
    impactBackgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    impactGradient: {
        flex: 1,
        padding: 24,
        backgroundColor: 'rgba(26, 188, 156, 0.9)',
    },
    impactContent: {
        padding: 0,
        alignItems: 'center',
    },
    impactIcon: {
        marginBottom: 12,
    },
    impactTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    impactText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        marginBottom: 20,
    },
    missionStats: {
        flexDirection: 'row',
        marginTop: 16,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'space-around',
    },
    missionStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    missionStatDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    missionStatValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    missionStatLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    howItWorksContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    howItWorksCard: {
        marginBottom: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    lastCard: {
        marginBottom: 0,
    },
    howItWorksContent: {
        flexDirection: 'row',
        padding: 0,
    },
    howItWorksImageContainer: {
        width: 120,
        height: 120,
        position: 'relative',
    },
    howItWorksImage: {
        width: '100%',
        height: '100%',
    },
    stepBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1ABC9C',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    stepBadgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    howItWorksTextContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    howItWorksHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    howItWorksTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    howItWorksDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginTop: 4,
    },
    impactStoriesContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    impactStoryCard: {
        marginBottom: 16,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        overflow: 'hidden',
    },
    impactStoryWrapper: {
        position: 'relative',
        height: 200,
    },
    impactStoryImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    impactStoryOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    impactStoryContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    impactStoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    impactStoryLocation: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginLeft: 6,
        fontWeight: '500',
    },
    impactStoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    impactStoryDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.95)',
        lineHeight: 20,
        fontWeight: '500',
    },
    bottomSpacing: {
        height: 20,
    },
});

export default HomeScreen;
