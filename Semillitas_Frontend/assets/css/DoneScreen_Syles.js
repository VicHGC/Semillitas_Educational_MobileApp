import { StyleSheet } from 'react-native';

export const COLORS = {
    PRIMARY: '#00C8B3',         
    ACCENT_YELLOW: '#ffec7eff',   
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  image: {
    width: 200,
    height: 200,
  },

  loadingText: {
    fontSize: 34,
    color: 'white',
    fontFamily: 'NuevaFuente',
  },
});