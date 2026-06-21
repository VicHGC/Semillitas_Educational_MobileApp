import { StyleSheet, Dimensions } from 'react-native';

export const COLORS = {
    PRIMARY: '#00C8B3',         
    // ACCENT_YELLOW: '#ffec7eff',   
    ACCENT_YELLOW: '#ffec7eff',   
    WHITE: '#FFFFFF',           
    TEXT: '#ffffffff',            
    CARD_BACKGROUND: '#11c87bff',
    BORDER_GRAY: '#070606ff',     
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const sideMenuStyles = StyleSheet.create({

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9, 
  },

  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 5,
    elevation: 5,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 10,
  },

  title: {
    fontSize: 18,
    marginTop:30,
    marginBottom: 20,
    fontFamily: 'NuevaFuente',
    color:COLORS.WHITE,

  },

  option: {
    marginVertical: 10,
  },

  optionText: {
    fontFamily: 'NuevaFuente',
    color:COLORS.WHITE,
  },
});

export const MENU_WIDTH = SCREEN_WIDTH * 0.7;
