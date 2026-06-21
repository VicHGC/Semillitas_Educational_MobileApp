import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiClient from './utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from './utils/logger';

import SemillinIconLocal from './assets/FatherMainAssets/Semillin.png';
const { width } = Dimensions.get('window');

const Shop = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { childId, coins, currentAvatarUrl } = route.params || {};

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [childCoins, setChildCoins] = useState(coins || 0);
    const [equippedUrl, setEquippedUrl] = useState(currentAvatarUrl);
    const [purchasedItemIds, setPurchasedItemIds] = useState([]);

    useEffect(() => {
        fetchShopItems();
    }, []);

    const fetchShopItems = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await apiClient.get(`/api/shop/items?sonId=${childId}`);

            if (response.data.success) {
                const itemsWithEquipped = response.data.items.map(item => ({
                    ...item,
                    isEquipped: item.image_url === equippedUrl,
                    isPurchased: item.isPurchased || false
                }));
                setItems(itemsWithEquipped);
                
                // Extraer IDs comprados del backend
                const purchasedIds = itemsWithEquipped
                    .filter(item => item.isPurchased)
                    .map(item => item.id);
                setPurchasedItemIds(purchasedIds);
            }
        } catch (error) {
            logger.apiError('Error fetching shop items', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = (item) => {
        if (item.isEquipped) return;
        
        Alert.alert(
            "Comprar Avatar",
            `¿Quieres comprar "${item.item_name}" por ${item.price} monedas?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Comprar", 
                    onPress: async () => {
                        try {
                            const response = await apiClient.post(
                                '/api/shop/buy',
                                { sonId: childId, itemId: item.id, price: item.price }
                            );

                            if (response.data.success) {
                                // Actualizar monedas
                                setChildCoins(prev => prev - item.price);
                                
                                // Agregar a la lista de comprados
                                const newPurchasedIds = [...purchasedItemIds, item.id];
                                setPurchasedItemIds(newPurchasedIds);
                                
                                // Actualizar avatar equipado
                                setEquippedUrl(item.image_url);
                                
                                // Marcar todos los items correctamente
                                setItems(prevItems => prevItems.map(i => ({
                                    ...i,
                                    isEquipped: i.image_url === item.image_url,
                                    isPurchased: i.id === item.id || newPurchasedIds.includes(i.id)
                                })));
                            } else {
                                Alert.alert("Error", response.data.message);
                            }
                        } catch (error) {
                            Alert.alert("Error", "No se pudo completar la compra");
                        }
                    }
                }
            ]
        );
};

    const handleEquip = async (item) => {
        if (item.isEquipped || !purchasedItemIds.includes(item.id)) return;
        
        try {
            const token = await AsyncStorage.getItem('accessToken');
            
            // Actualizar avatar en el backend
            await apiClient.put(
                '/api/son-home/avatar',
                { sonId: childId, avatarUrl: item.image_url }
            );
            
            // Actualizar avatar equipado local
            setEquippedUrl(item.image_url);
            
            // Actualizar estado de items
            setItems(prevItems => prevItems.map(i => ({
                ...i,
                isEquipped: i.image_url === item.image_url
            })));
            
        } catch (error) {
            logger.apiError('Error al equipar avatar', error);
            Alert.alert("Error", "No se pudo equipar el avatar");
        }
    };
    
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image 
                        source={require('./assets/SelectTheGame/icon-regresar.png')} 
                        style={styles.backIcon} 
                        resizeMode="contain" 
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Tienda</Text>
                <View style={styles.iconWrapperRight}>
                    <View style={styles.coinContainer}>
                        <Text style={styles.coinText}>🪙 {childCoins}</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Elige tu nuevo estilo</Text>

                <View style={styles.itemsGrid}>
                    {items.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[styles.itemCard, item.isEquipped && styles.itemEquipped]}
                            onPress={() => item.isEquipped ? null : (purchasedItemIds.includes(item.id) ? handleEquip(item) : handleBuy(item))}
                            disabled={item.isEquipped}
                            activeOpacity={item.isEquipped ? 1 : 0.7}
                        >
                            {item.isEquipped && (
                                <View style={styles.equippedBadge}>
                                    <Text style={styles.equippedBadgeText}>✓ EQUIPADO</Text>
                                </View>
                            )}
                            <Image 
                                source={{ uri: item.image_url }} 
                                style={styles.itemImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.itemName}>{item.item_name}</Text>
                            <View style={[styles.priceTag, item.isEquipped && styles.priceTagEquipped, !item.isEquipped && purchasedItemIds.includes(item.id) && styles.priceTagEquip]}>
                                <Text style={[styles.priceText, item.isEquipped && styles.priceTextEquipped, !item.isEquipped && purchasedItemIds.includes(item.id) && styles.priceTextEquip]}>
                                    {item.isEquipped ? '✓' : (purchasedItemIds.includes(item.id) ? '🎯 EQUIPAR' : `🪙 ${item.price}`)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {items.length === 0 && (
                    <Text style={styles.emptyText}>¡Próximamente más avatares!</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4FC3F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 60,
        backgroundColor: '#0288D1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    headerText: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'NuevaFuente',
    },
    backButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    backIcon: {
        width: 60,
        height: 60,
        tintColor: '#FFF',
    },
    iconWrapperRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinContainer: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    coinText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    title: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    itemCard: {
        width: '45%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        margin: '2.5%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    itemImage: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    priceTag: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    priceText: {
        color: '#333',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    itemEquipped: {
        backgroundColor: '#E8F5E9',
        borderColor: '#4CAF50',
        borderWidth: 3,
    },
    equippedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        zIndex: 10,
        elevation: 5,
    },
    equippedBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceTagEquipped: {
        backgroundColor: '#4CAF50',
    },
    priceTextEquipped: {
        color: '#FFF',
    },
    priceTagEquip: {
        backgroundColor: '#2196F3',
    },
    priceTextEquip: {
        color: '#FFF',
    },
});

export default Shop;