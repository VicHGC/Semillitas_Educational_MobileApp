import { StyleSheet } from 'react-native';

export const COLORS = {
    BACKGROUND: '#00C8B3',        
    ACCENT_YELLOW: '#FFD700',   
    LIGHT_GRAY: '#E0E0E0',    
    WHITE: '#FFFFFF',
    BROWN: '#CD8006',
    BLACK: '#000000ff'     
};

export const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 30,
        position: 'relative', 
    },

    logo: {
        width: 330, 
        height: 330,
        marginRight:115,
        marginTop:-45,
        transform: [{ rotate: '40deg' }], 
        position: 'absolute',
        top: 60, 
        right: 40,
        zIndex: 1, 
    },

    title: {
        fontSize: 40,
        color: COLORS.ACCENT_YELLOW,
        marginTop:-20,
        marginBottom: 30,
        zIndex: 2, 
        fontFamily: 'NuevaFuente',
    },

    textoCreaCuenta:{
        fontSize: 15,
        fontWeight: '700', 
        color: COLORS.WHITE,
        marginBottom: 5, 
        marginTop:140,
        zIndex: 2,
    }, 
    
    textoIngresa:{
        fontSize: 15,
        color: COLORS.WHITE,
        textAlign: 'center', 
        zIndex: 2,
    }, 

    inputPaper: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: COLORS.WHITE, 
        height: 55, 
        outlineColor: COLORS.BLACK, 
    },

    LogInButton: {
        width: '100%',
        backgroundColor: COLORS.BROWN,
        borderRadius: 10,
        marginBottom: 20,
        paddingVertical: 5, 
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },

    loginButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: 'NuevaFuente',
    },

    QrButton: {
        width: '100%',
        borderRadius: 10,
        marginBottom: 25,
        paddingVertical: 5,
        backgroundColor: COLORS.ACCENT_YELLOW,
        borderWidth: 1,
        borderColor: COLORS.ACCENT_YELLOW,
    },

    QrButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: 'NuevaFuente',
    },

    secondaryText: {
        color: COLORS.WHITE,
        fontSize: 14,
        textDecorationLine: 'underline',
        marginTop: 10, 
    },  

    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.LIGHT_GRAY,
    },

    separatorText: {
        width: 30,
        textAlign: 'center',
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: '500',
    },

    GoogleSignButton: {
        width: '100%',
        marginBottom: 10,
        borderRadius: 15,
        paddingVertical: 5,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
    },

    GoogleSignText: {
        color: COLORS.BLACK,
        fontSize: 16,
    },
    
    AppleSignButton: {
        width: '100%',
        marginBottom: 10,
        borderRadius: 15,
        paddingVertical: 5,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
    },

    AppleSignText: {
        color: COLORS.BLACK,
        fontSize: 16,
    },
});