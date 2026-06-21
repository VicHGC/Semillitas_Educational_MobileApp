import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './assets/css/FatherMain_Styles';
import SideMenu from './SideMenu';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import apiClient from './utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserIconLocal = require('./assets/FatherMainAssets/User.png');
const MenuIconLocal = require('./assets/FatherMainAssets/MenuIcon.png');
const SemillinIconLocal = require('./assets/FatherMainAssets/Semillin.png');

const FatherMain = () => {
  const navigation = useNavigation();
  const menuRef = useRef();
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLevelText = (age) => {
    if (age <= 4) return 'Nivel Inicial';
    if (age <= 6) return 'Nivel Básico';
    if (age <= 8) return 'Nivel Intermedio';
    return 'Nivel Avanzado';
  };

  const loadChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        setError('No se encontró token de autenticación');
        setLoading(false);
        return;
      }

      console.log('🔍 Cargando hijos...');
      const response = await apiClient.get('/fatherMain/obtenerHijos');

 if (response.data.success) {
        const DEFAULT_AVATAR_URL = "https://pub-b8d90bf906d3498aa934aae83a10a3d3.r2.dev/basicAvatar.PNG"; // <-- PON TU URL DE R2 AQUÍ

        const formattedData = response.data.hijos.map(hijo => {
          // Verificamos que sea una URL real (que empiece con http)
          const isValidUrl = hijo.avatar_url && hijo.avatar_url.startsWith('http');

          return {
            id: hijo.id,
            name: hijo.name,
            age: hijo.age,
            // Si es válida usa la de la BD, si no, usa la de Cloudflare
            avatarSource: isValidUrl ? { uri: hijo.avatar_url } : { uri: DEFAULT_AVATAR_URL },
            info: `${hijo.age} años | ${getLevelText(hijo.age)}`,
            coins: hijo.coins || 0,
            expPoints: hijo.exp_points || 0,
            rawData: hijo
          };
        });
        
        setChildrenData(formattedData);
      } else {
        setError('Error: ' + (response.data.message || 'Desconocido'));
      }
    } catch (error) {
      console.error('❌ Error al cargar hijos:', error);
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  // Optimizacion: useFocusEffect ya corre al montar, no necesitas useEffect extra
  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [])
  );

  const handleChildPress = (child) => {
    navigation.navigate('AccesoTemporalSon', { 
        childData: child.rawData,
        childName: child.name
      });
  };

  // --- FUNCIÓN DE RENDERIZADO (Para evitar errores de Texto suelto) ---
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando hijos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadChildren}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (childrenData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay hijos registrados</Text>
          <Text style={styles.emptySubtext}>Presiona el botón + para agregar un hijo</Text>
        </View>
      );
    }

    // Si hay datos, mapeamos
    const getLevelBadge = (expPoints) => {
        if (expPoints >= 600) return { emoji: '🏆', text: 'Avanzado', color: '#FFD700' };
        if (expPoints >= 300) return { emoji: '⭐', text: 'Intermedio', color: '#4FC3F7' };
        if (expPoints >= 100) return { emoji: '📖', text: 'Básico', color: '#81C784' };
        return { emoji: '🌱', text: 'Inicial', color: '#A5D6A7' };
    };

    const getModuleIcon = (moduleName) => {
        if (moduleName === 'Matemáticas' || moduleName === 'Matematicas') return '🔢';
        if (moduleName === 'Español' || moduleName === 'Espanol') return '📚';
        return '📖';
    };

    return childrenData.map(child => {
        const levelBadge = getLevelBadge(child.expPoints);
        const modules = child.rawData.modules || [];
        
        return (
            <TouchableOpacity
                key={child.id}
                style={styles.card}
                onPress={() => handleChildPress(child)}
            >
                <View style={styles.cardContentWrapper}>
                    <Image 
                        source={child.avatarSource} 
                        style={styles.avatarImage}
                        defaultSource={UserIconLocal}
                    />
                    <View style={styles.textContainer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.cardTitle}>{child.name}</Text>
                            <View style={[styles.levelBadge, { backgroundColor: levelBadge.color }]}>
                                <Text style={styles.levelBadgeText}>{levelBadge.emoji} {levelBadge.text}</Text>
                            </View>
                        </View>
                        <Text style={styles.cardSubtitle}>{child.info}</Text>
                        
                        {/* Iconos de módulos activos */}
                        {modules.length > 0 && (
                            <View style={styles.modulesRow}>
                                {modules.map((mod, idx) => (
                                    <Text key={idx} style={styles.moduleIcon}>{getModuleIcon(mod)}</Text>
                                ))}
                            </View>
                        )}
                        
                        <Text style={styles.coinsText}>
                            🪙 {child.coins} | ⭐ {child.expPoints} XP
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => menuRef.current?.toggleMenu()} style={styles.iconWrapperLeft}>
          <Image source={MenuIconLocal} style={styles.menuIcon} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Semillitas</Text>

        <View style={styles.iconWrapperRight}>
          <Image source={SemillinIconLocal} style={styles.semillinImage} />
        </View>
      </View>

      {/* CONTENIDO SCROLLABLE */}
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* Aquí llamamos a la función limpia */}
        {renderContent()}

        {/* Espacio final seguro */}
        <View style={{ height: 20 }} /> 
      </ScrollView>

      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateSon')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* MENÚ LATERAL */}
      <SideMenu ref={menuRef} />
    </SafeAreaView>
  );
};

export default FatherMain;