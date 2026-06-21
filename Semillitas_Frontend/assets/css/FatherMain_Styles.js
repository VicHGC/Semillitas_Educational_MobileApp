import { StyleSheet } from 'react-native';

export const COLORS = {
    PRIMARY: '#00C8B3',         
    ACCENT_YELLOW: '#ffec7eff',   
    WHITE: '#FFFFFF',           
    TEXT: '#ffffffff',            
    CARD_BACKGROUND: '#11c87bff',
    BORDER_GRAY: '#070606ff',     
    ERROR_RED: '#FF3B30',
    SUCCESS_GREEN: '#4CD964',
    LOADING_BLUE: '#007AFF',
    GRAY: '#666666',
    LIGHT_GRAY: '#999999',
    DARK_GRAY: '#888888',
};

export const styles = StyleSheet.create({
    // Estilos del header
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

    // Contenedores principales
    container: {
        flex: 1,
        backgroundColor: COLORS.ACCENT_YELLOW, 
    },
    
    header: {
        height: 45, 
        backgroundColor: COLORS.PRIMARY, 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        paddingBottom: 5,
    },
    headerText: {
        color: COLORS.WHITE,
        fontSize: 35,
        fontFamily: 'NuevaFuente',
    },
    
    content: {
        flex: 1, 
        backgroundColor: COLORS.ACCENT_YELLOW, 
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    // Tarjetas de hijos
    card: {
        backgroundColor: COLORS.CARD_BACKGROUND,
        borderRadius: 8,
        padding: 16,     
        marginBottom: 30, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 }, 
        shadowOpacity: 0.6,         
        shadowRadius: 10,           
        elevation: 20, 
    },

    cardContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center', 
    },
    
    avatarImage: {
        width: 60,            
        height: 60,
        borderRadius: 30, 
        marginRight: 15,     
        borderWidth: 2,       
        borderColor: COLORS.BORDER_GRAY, 
    },
    
    textContainer: {
        flex: 1, 
        justifyContent: 'center',
    },
    
    cardTitle: {
        fontSize: 18,
        color: COLORS.TEXT,
        fontFamily: 'NuevaFuente',
        marginBottom: 2,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    levelBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
        marginLeft: 8,
    },

    levelBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'NuevaFuente',
    },

    modulesRow: {
        flexDirection: 'row',
        marginTop: 4,
    },

    moduleIcon: {
        fontSize: 18,
        marginRight: 6,
    },
    
    cardSubtitle: {
        fontSize: 14,
        color: COLORS.TEXT,
        opacity: 0.9,
        fontFamily: 'NuevaFuente',
        marginBottom: 2,
    },

    coinsText: {
        fontSize: 12,
        color: COLORS.TEXT,
        opacity: 0.8,
        fontFamily: 'NuevaFuente',
        marginTop: 2,
    },

    // Estados de carga y error
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.GRAY,
        fontFamily: 'NuevaFuente',
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },

    errorText: {
        fontSize: 16,
        color: COLORS.ERROR_RED,
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'NuevaFuente',
    },

    debugText: {
        fontSize: 12,
        color: COLORS.GRAY,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'NuevaFuente',
    },

    retryButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },

    retryButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'NuevaFuente',
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },

    emptyText: {
        fontSize: 18,
        color: COLORS.GRAY,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'NuevaFuente',
    },

    emptySubtext: {
        fontSize: 14,
        color: COLORS.LIGHT_GRAY,
        textAlign: 'center',
        fontFamily: 'NuevaFuente',
    },

    // Botón de agregar
    addButton: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#ff3b3b', 
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 0,
    },

    addButtonText: {
        fontSize: 45,
        color: COLORS.WHITE,
        marginTop: -3,
        fontFamily: 'NuevaFuente',
    },

    // Espaciadores
    spacer: {
        height: 20,
    },

    // Indicador de actividad
    activityIndicator: {
        transform: [{ scale: 1.2 }],
    },
});