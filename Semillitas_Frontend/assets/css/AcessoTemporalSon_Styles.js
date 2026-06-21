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
    BUTTON_PRIMARY: '#ff3b3b',
};

export const styles = StyleSheet.create({
    // 🔹 CONTENEDORES PRINCIPALES (Igual que las otras vistas)
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
        justifyContent: 'center',
        alignItems: 'center',
    },

    // 🔹 BOTÓN DE VISITAR HIJO
    visitButton: {
        backgroundColor: COLORS.BUTTON_PRIMARY,
        width: '80%',
        height: 150,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
        borderWidth: 3,
        borderColor: COLORS.BORDER_GRAY,
        padding: 20,
    },

    visitButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.WHITE,
        fontFamily: 'NuevaFuente',
        textAlign: 'center',
        marginBottom: 10,
    },

    visitButtonSubtext: {
        fontSize: 16,
        color: COLORS.WHITE,
        opacity: 0.9,
        fontFamily: 'NuevaFuente',
        textAlign: 'center',
    },
});