import { StyleSheet } from 'react-native';

// 1. Usamos tus MISMAS constantes de colores
export const COLORS = {
    PRIMARY: '#00C8B3',         
    ACCENT_YELLOW: '#ffec7eff',   
    WHITE: '#FFFFFF',           
    TEXT: '#ffffffff',            
    CARD_BACKGROUND: '#11c87bff', // Verde original
    BORDER_GRAY: '#070606ff',     
    ERROR_RED: '#FF3B30',
    // Colores nuevos para las tarjetas específicas de esta vista
    CARD_PURPLE: '#6200EE', 
    CARD_PINK: '#E91E63',
    TEXT_DARK: '#333333'
};

export const styles = StyleSheet.create({
    // --- HEADER (Exactamente igual a tu FatherMain) ---
    iconWrapperLeft: {
        position: 'absolute',
        left: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 10, 
    },
    menuIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#FFFFFF',
    },
    iconWrapperRight: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 10,
    },
    semillinImage: {
        width: 55,
        height: 55,
        borderRadius: 20, 
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.ACCENT_YELLOW, 
    },
    header: {
        height: 50, 
        backgroundColor: COLORS.PRIMARY, 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        paddingBottom: 5,
        // Agregué elevación para que se separe del contenido
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
    },
    headerText: {
        color: COLORS.WHITE,
        fontSize: 35,
        fontFamily: 'NuevaFuente', // Tu fuente personalizada
    },
    
    // --- CONTENIDO ---
    content: {
        flex: 1, 
        backgroundColor: COLORS.ACCENT_YELLOW, 
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    scrollContent: {
        paddingBottom: 40,
        alignItems: 'center',
    },

    // --- TARJETAS BASES (Heredan tu estilo de sombra y bordes) ---
    baseCard: {
        width: '100%',
        borderRadius: 15, // Un poco más redondeado para tarjetas grandes
        padding: 20,     
        marginBottom: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.6,         
        shadowRadius: 10,           
        elevation: 10, 
        alignItems: 'center',
    },

    // 1. Tarjeta Morada (Perfil)
    purpleCard: {
        backgroundColor: COLORS.CARD_PURPLE,
        borderWidth: 1,
        borderColor: COLORS.BORDER_GRAY,
    },
    
    // 2. Tarjeta Rosa (Métricas)
    pinkCard: {
        backgroundColor: COLORS.CARD_PINK,
        borderWidth: 1,
        borderColor: COLORS.BORDER_GRAY,
    },

    // 3. Tarjeta Blanca (Detalles)
    whiteCard: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.BORDER_GRAY,
    },

    // --- ELEMENTOS INTERNOS ---
    
    // Avatar grande
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.WHITE,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#ccc',
    },
    avatarImageLarge: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    
    // Textos
    cardTitleWhite: {
        fontSize: 24,
        color: COLORS.WHITE,
        fontFamily: 'NuevaFuente',
        marginBottom: 15,
        textAlign: 'center',
    },
    cardTitleDark: {
        fontSize: 20,
        color: COLORS.TEXT_DARK,
        fontFamily: 'NuevaFuente',
        marginBottom: 10,
        textAlign: 'center',
    },
    
    // Botón "Visitar"
    visitButton: {
        backgroundColor: COLORS.ACCENT_YELLOW,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.BORDER_GRAY,
        marginTop: 5,
    },
    visitButtonText: {
        color: '#000',
        fontFamily: 'NuevaFuente',
        fontSize: 16,
    },

    // Elementos de Gráfica (Simulados con View)
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    pieChartBig: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderWidth: 8,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pieSlice: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    chartCenter: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartPercent: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    chartLabel: {
        fontSize: 12,
        color: '#FFF',
        marginTop: 5,
        fontWeight: '600',
    },
    smallChartsCol: {
        gap: 10,
    },
    pieChartSmall: {
        width: 50, height: 50,
        borderRadius: 25,
        backgroundColor: '#4FC3F7',
        borderWidth: 2, borderColor: COLORS.WHITE,
    },

    // Detalles (Texto oscuro para fondo blanco)
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 8,
    },
    detailLabel: {
        fontFamily: 'NuevaFuente',
        fontSize: 16,
        color: '#666',
    },
    detailValue: {
        fontFamily: 'NuevaFuente',
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});