import { StyleSheet } from 'react-native';

export const COLORS = {
    PRIMARY: '#00C8B3',         
    ACCENT_YELLOW: '#ffec7eff',   
    WHITE: '#FFFFFF',           
    TEXT: '#ffffffff',            
    CARD_BACKGROUND: '#11c87bff',
    BORDER_BROWN: '#070606ff',  
    TEXT: '#ff3b3b'   
};

export const styles = StyleSheet.create({

  container: { 
    flex: 1, backgroundColor: COLORS.ACCENT_YELLOW,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
  },

  menuIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },

  headerText: {
    fontSize: 35,
    color: '#fff',
    fontFamily: 'NuevaFuente',
  },

  semillinImage: {
    width: 55,
    height: 55,
    resizeMode: 'cover',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -250,                // 🔹 empuja un poco desde el header
  },

  text: {
    fontSize: 18,
  },

  inputRow: {
    flexDirection: 'row',         // 🔸 Texto e input en línea
    alignItems: 'center',         // 🔸 Centra verticalmente ambos
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },

  inputLabel: {
    fontSize: 18,
    color: COLORS.TEXT,
    fontFamily: 'NuevaFuente',
    marginRight: 10,
    flex: 0.4,                    // 🔸 Ocupa 40% del ancho
  },

  inputPaper: {
    flex: 1,                      // 🔸 Ocupa el espacio restante
    backgroundColor: COLORS.WHITE,
  },

modulesContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 20,
    width:370,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },

  modulesTitle: {
    fontSize: 20,
    fontFamily: 'NuevaFuente',
    color: COLORS.WHITE,
    marginBottom: 15,
    textAlign: 'center',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },

  checkboxLabel: {
    fontSize: 18,
    color: COLORS.WHITE,
    fontFamily: 'NuevaFuente',
  },

  addButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.TEXT, // 🔴 Rojo intenso
    borderRadius: 40,
    width: '60%',
    paddingVertical: 10,
    marginVertical: 30,
    elevation: 6, // sombra en Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 22,
    color: COLORS.WHITE,
    fontFamily: 'NuevaFuente',
  },
});
