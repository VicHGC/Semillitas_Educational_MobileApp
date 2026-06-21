import { StyleSheet } from 'react-native';

export const COLORS = {
    PRIMARY: '#00C8B3',
    LESSON_1_START: '#82f3ff',
    LESSON_1_END: 'rgb(255, 213, 79)',
    LESSON_2_START: '#CE93D8',
    LESSON_2_END: '#4ff798',
    LESSON_3_START: '#A5D6A7',
    LESSON_3_END: '#66BB6A',
    LESSON_4_START: '#CE93D8',
    LESSON_4_END: '#AB47BC',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4FC3F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#0288D1',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'NuevaFuente',
    },
    semillinImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    content: {
        padding: 15,
    },
    lessonSection: {
        marginBottom: 30,
    },
    lessonHeaderBubble: {
        alignSelf: 'center',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        elevation: 5,
    },
    lessonHeaderText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#E65100',
        fontFamily: 'NuevaFuente',
    },
    activitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    activityCard: {
        width: '42%',
        aspectRatio: 0.9,
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    activityLocked: {
        backgroundColor: '#CFD8DC',
        opacity: 0.8,
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        padding: 4,
    },
    activityIcon: {
        fontSize: 45,
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 4,
    },
    activityTypeText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: 'white',
        marginTop: 20,
        fontSize: 18,
        fontFamily: 'NuevaFuente',
    },
     container: { flex: 1, backgroundColor: '#4FC3F7' }, // Azul cielo base
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#0288D1' },
    headerText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'NuevaFuente' },
    semillinImage: { width: 40, height: 40, resizeMode: 'contain' },
    content: { padding: 15 },

    // Estilos de la Lección
lessonSection: {
        marginBottom: 35,
    },
    lessonHeaderBubble: {
        alignSelf: 'center',       // 🌟 ¡Centrado de nuevo como querías!
        paddingHorizontal: 25,     // Un poco más de aire a los lados para que respire el texto
        paddingVertical: 10,
        borderRadius: 15,          // Bordes redondeados más sutiles y modernos
        marginBottom: 18,
        // Sombras suaves premium (adiós a la elevación tosca)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 20,              // Sombra sutil para Android
    },
    lessonHeaderText: {
        fontSize: 19,              // Tamaño perfecto para resaltar sin saturar
        fontWeight: 'bold',
        color: '#FFFFFF',          // Texto blanco puro: contrasta hermoso con cualquier fondo
        fontFamily: 'NuevaFuente',
        letterSpacing: 0.5,
        textAlign: 'center',       // Asegura que el texto interno también esté centrado
    },

    // Grid de Actividades
    activitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start' // Alinear a la izquierda
    },
    activityCard: {
        backgroundColor: 'white',
        width: '30%', // Para que quepan 3 por fila aprox
        aspectRatio: 1, // Cuadrado
        borderRadius: 15,
        margin: '1.5%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    activityLocked: {
        backgroundColor: '#CFD8DC', // Gris
        opacity: 0.8
    },
    statusBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 2
    },
    scoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4CAF50'
    },

    backIconImage: {
        width: 50,        // Tamaño ideal para la barra superior
        height: 50,       // Proporción cuadrada
    },

    backButtonWrapper: {
        padding: 5,       // Agrega un área de toque más cómoda para los niños
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIconImage: {
    width: 50,          // Tamaño ideal y responsivo para la rejilla
    height: 50,
    marginBottom: 8,    // Espaciado balanceado con el texto inferior
    alignSelf: 'center',
  },
});