import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import apiClient from './utils/apiClient';
import { styles, COLORS } from './assets/css/ActivityScreen_Styles';

const SemillinIconLocal = require('./assets/FatherMainAssets/Semillin.png');

// Colores para cada lección
const getLessonColors = (lessonId) => {
    const colorPairs = [
        [COLORS.LESSON_1_START, COLORS.LESSON_1_END],
        [COLORS.LESSON_2_START, COLORS.LESSON_2_END],
        [COLORS.LESSON_3_START, COLORS.LESSON_3_END],
        [COLORS.LESSON_4_START, COLORS.LESSON_4_END],
    ];
    return colorPairs[(lessonId - 1) % colorPairs.length];
};

export default function ActivityScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { moduleName, childId } = route.params || {};

    const [groupedLessons, setGroupedLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchLessons = async () => {
                try {
                    const response = await apiClient.get(
                        `/api/activities/lessons/${moduleName}/${childId}`
                    );

                    if (response.data.success) {
                        setGroupedLessons(response.data.lessons);
                    }
                } catch (error) {
                    console.error("Error cargando lecciones:", error);
                } finally {
                    setLoading(false);
                }
            };
            if (moduleName && childId) {
                fetchLessons();
            }
        }, [moduleName, childId])
    );

    const handlePressActivity = (activity) => {
        if (activity.status === 'locked') {
            Alert.alert("Bloqueado 🔒", "¡Completa el juego anterior para desbloquear este!");
            return;
        }
        navigation.navigate('gameScreen', { 
            activityId: activity.id, 
            childId: childId,
            activityType: activity.type 
        });
    };

    const getActivityIcon = (type) => {
            switch(type) {
                case 'voz': 
                    return require('./assets/SelectTheGame/game-voz.png');
                case 'caligrafia': 
                    return require('./assets/SelectTheGame/game-caligrafia.png');
                case 'problema': 
                    return require('./assets/SelectTheGame/game-problema.png');
            }
    };

    const getActivityTypeText = (type) => {
        switch(type) {
            case 'voz': return 'Voz';
            case 'caligrafia': return 'Escritura';
            case 'problema': return 'Problema';
            default: return 'Juego';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
                {/* BOTÓN REGRESAR ACTUALIZADO: Cambiamos el emoji de la flecha por tu icono PNG */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonWrapper}>
                    <Image 
                        source={require('./assets/SelectTheGame/icon-regresar.png')} 
                        style={styles.backIconImage} 
                        resizeMode="contain" 
                    />
                </TouchableOpacity>
                
                <Text style={styles.headerText}>{moduleName || "Mundo"}</Text>
                <Image source={SemillinIconLocal} style={styles.semillinImage} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{marginTop: 50}} />
                ) : (
                    groupedLessons.map((lesson, index) => {
                        const [startColor, endColor] = getLessonColors(lesson.id || index + 1);
                        return (
                            <View key={lesson.id || index} style={styles.lessonSection}>
                                <View style={[styles.lessonHeaderBubble, { backgroundColor: startColor }]}>
                                    <Text style={styles.lessonHeaderText}>{lesson.name}</Text>
                                </View>

                                <View style={styles.activitiesGrid}>
                                    {lesson.activities.map((act) => (
                                        <TouchableOpacity 
                                            key={act.id}
                                            style={[
                                                styles.activityCard,
                                                act.status === 'locked' && styles.activityLocked
                                            ]}
                                            onPress={() => handlePressActivity(act)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.statusBadge}>
                                                <Text style={{fontSize: 14}}>
                                                    {act.status === 'completed' ? '⭐' : act.status === 'locked' ? '🔒' : '▶️'}
                                                </Text>
                                            </View>

                                            {/* 🌟 ACTUALIZADO: Cambiamos de <Text> a <Image> para usar PNGs profesionales */}
                                            <Image 
                                                source={getActivityIcon(act.type)} 
                                                style={styles.activityIconImage} 
                                                resizeMode="contain" 
                                            />

                                            <Text style={styles.activityTypeText}>
                                                {getActivityTypeText(act.type)}
                                            </Text>

                                            {act.score > 0 && (
                                                <Text style={styles.scoreText}>✅ {act.score} pts</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        );
                    })
                )}
                
                {!loading && groupedLessons.length === 0 && (
                    <Text style={styles.emptyText}>
                        ¡Próximamente más aventuras aquí!
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#4FC3F7' }, // Azul cielo base
//     header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#0288D1' },
//     headerText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'NuevaFuente' },
//     semillinImage: { width: 40, height: 40, resizeMode: 'contain' },
//     content: { padding: 15 },

//     // Estilos de la Lección
//     lessonSection: { marginBottom: 30 },
//     lessonHeaderBubble: {
//         backgroundColor: '#FFEB3B', // Amarillo brillante
//         alignSelf: 'flex-start',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 25,
//         marginBottom: 15,
//         borderWidth: 2,
//         borderColor: '#FBC02D',
//         elevation: 3
//     },
//     lessonHeaderText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#E65100',
//         fontFamily: 'NuevaFuente'
//     },

//     // Grid de Actividades
//     activitiesGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'flex-start' // Alinear a la izquierda
//     },
//     activityCard: {
//         backgroundColor: 'white',
//         width: '30%', // Para que quepan 3 por fila aprox
//         aspectRatio: 1, // Cuadrado
//         borderRadius: 15,
//         margin: '1.5%',
//         alignItems: 'center',
//         justifyContent: 'center',
//         elevation: 4,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 3,
//     },
//     activityLocked: {
//         backgroundColor: '#CFD8DC', // Gris
//         opacity: 0.8
//     },
//     statusBadge: {
//         position: 'absolute',
//         top: 5,
//         right: 5,
//         backgroundColor: 'rgba(255,255,255,0.5)',
//         borderRadius: 10,
//         padding: 2
//     },
//     scoreText: {
//         fontSize: 12,
//         fontWeight: 'bold',
//         color: '#4CAF50'
//     },

//     backIconImage: {
//         width: 50,        // Tamaño ideal para la barra superior
//         height: 50,       // Proporción cuadrada
//     },

//     backButtonWrapper: {
//         padding: 5,       // Agrega un área de toque más cómoda para los niños
//         justifyContent: 'center',
//         alignItems: 'center',
//     }
// });

