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
    MATH_GREEN: '#4CAF50',
    SPANISH_BLUE: '#2196F3',
    COIN_YELLOW: '#FFD700',
    COIN_DARK: '#8B6914',
    XP_GREEN: '#4CAF50',
    SHOP_BLUE: '#2196F3',
};

export const styles = StyleSheet.create({
    // 🔹 CONTENEDORES PRINCIPALES (Igual que FatherMain)
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

    content: {
        flex: 1, 
        backgroundColor: COLORS.ACCENT_YELLOW, 
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    // 🔹 BARRA SUPERIOR
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: COLORS.WHITE,
        borderRadius: 15,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },

    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.COIN_YELLOW,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        position: 'relative',
    },

    coinEmoji: {
        fontSize: 18,
        marginRight: 4,
    },

    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5D4037',
        fontFamily: 'NuevaFuente',
    },

    coinTooltip: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        marginTop: 5,
        zIndex: 100,
    },

    coinTooltipText: {
        color: '#FFF',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'NuevaFuente',
    },

    xpContainer: {
        alignItems: 'flex-start',
        flex: 1,
    },

    xpLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },

    xpIcon: {
        fontSize: 14,
        marginRight: 3,
    },

    xpText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'NuevaFuente',
    },

    xpBarBackground: {
        width: 90,
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#BDBDBD',
    },

    xpBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },

    xpPercent: {
        fontSize: 11,
        color: '#333',
        marginTop: 2,
    },

    xpBarContainer: {
        flexDirection: 'column',
    },

    shopButton: {
        backgroundColor: COLORS.SHOP_BLUE,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },

    shopButtonImage: {
        width: 26,
        height: 26,
    },

    // 🔹 BOTONES DE MATERIAS
    subjectsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    subjectButton: {
        width: '92%',
        height: 160,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        elevation: 20,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.5)',
    },

    mathButton: {
        backgroundColor: '#43A047',
    },

    spanishButton: {
        backgroundColor: '#1976D2',
    },

    subjectIcon: {
        fontSize: 55,
        marginBottom: 8,
    },

    subjectTitle: {
        fontSize: 28,
        color: COLORS.WHITE,
        fontWeight: 'bold',
        fontFamily: 'NuevaFuente',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },

    subjectSubtitle: {
        fontSize: 16,
        color: COLORS.WHITE,
        opacity: 0.9,
        fontFamily: 'NuevaFuente',
        textAlign: 'center',
    },

    // 🔹 TEXTO INFORMATIVO
    infoText: {
        textAlign: 'center',
        color: COLORS.GRAY,
        fontSize: 16,
        marginBottom: 30,
        marginTop: 5,
        fontFamily: 'NuevaFuente',
    },

    subjectImage: {
        width: 70,        // Ajusta el tamaño de acuerdo a tu diseño
        height: 70,       // Mantén una escala cuadrada equilibrada
        alignSelf: 'center',
    },

    backIconImage: {
        width: 50,        // Un poco más grande que el fontSize anterior para que destaque
        height: 50,       // Mantenlo cuadrado
        tintColor: '#FFF' 
    },// 💡 TIP OPCIONAL: Si tu icono es negro y tu header oscuro, esto lo vuelve blanco por código. Quítalo si tu icono ya tiene color.
    // 🔹 AVATAR DEL NIÑO
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    avatarImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#FFD700',
        backgroundColor: '#FFF',
    },
});