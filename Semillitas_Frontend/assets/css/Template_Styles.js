// assets/css/TemplateStyles.js
import { StyleSheet } from 'react-native';

// 🎨 Tus colores
export const COLORS = {
    PRIMARY: '#00C8B3',         
    ACCENT_YELLOW: '#ffec7eff',   
    WHITE: '#FFFFFF',           
    TEXT_WHITE: '#ffffffff', 
    CARD_BACKGROUND: '#11c87bff',
    BORDER_BROWN: '#070606ff', 
    TEXT: '#ff3b3b'
};

// --- ESTILOS ---
// Aquí exportamos los estilos que creamos
export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.ACCENT_YELLOW, // 💛 Tu fondo amarillo
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY, // 💚 Tu color primario
    paddingHorizontal: 20,
    height: 70, // Una altura estándar para la barra superior
  },
  headerPlaceholder: {
    width: 55, // Mismo ancho que tu imagen de Semillin para centrar el título
  },
  headerText: {
    fontSize: 35,
    color: COLORS.WHITE, // Color de texto blanco
    fontFamily: 'NuevaFuente', // Tu fuente personalizada
  },
  semillinImage: {
    width: 55,
    height: 55,
    resizeMode: 'cover', // Tal como lo tenías
  },
  content: {
    // 'flex: 1' hace que este contenedor ocupe todo el espacio
    // disponible entre el header y el footer.
    flex: 1, 
  },
  footer: {
    height: 60, // Altura para la barra inferior
    backgroundColor: COLORS.PRIMARY, // 💚 Mismo color que el header
  },
});