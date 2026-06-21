import React, { useEffect, useRef } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * AnimatedAlert - Alerta animada para niños
 * 
 * @param {boolean} visible - Control de visibilidad
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Título de la alerta
 * @param {string} message - Mensaje de la alerta
 * @param {string} buttonText - Texto del botón (default: "OK")
 * @param {function} onPress - Función al presionar el botón
 * @param {string} character - 'semillin' | 'star' | 'seed' (default: 'semillin')
 */
const AnimatedAlert = ({
  visible = false,
  type = 'info',
  title,
  message,
  buttonText = 'OK',
  onPress,
  character = 'semillin',
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animaciones
      scaleAnim.setValue(0);
      bounceAnim.setValue(0);
      opacityAnim.setValue(0);

      // Animación de entrada
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(300),
          Animated.spring(bounceAnim, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [visible]);

  const getBackgroundColor = () => {
    const colors = {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
    };
    return colors[type] || '#2196F3';
  };

  const handlePress = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }).start(() => {
        if (onPress) onPress();
      });
    });
  };

// 🌟 NOTA: Asegúrate de tener 'Image' importado arriba en tu archivo, así:
  // import { View, Text, Modal, TouchableOpacity, Animated, Image } from 'react-native';

 return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onPress}
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [
                { scale: scaleAnim },
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        >
          {/* 🌟 ACTUALIZADO: Adiós emojis. Ahora SÓLO y SIEMPRE se muestra Semillín pensando */}
          <View style={[styles.header, { backgroundColor: getBackgroundColor() }]}>
            <Image 
              source={require('../assets/SelectTheGame/pensando.png')} 
              style={styles.thinkingCharacterImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Botón */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getBackgroundColor() }]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    fontSize: 60,
    marginBottom: 5,
  },
  headerIcon: {
    fontSize: 30,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'NuevaFuente',
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'NuevaFuente',
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'NuevaFuente',
  },
  thinkingCharacterImage: {
    width: 75,          // Ajusta según qué tan grande quieras que resalte
    height: 75,
    alignSelf: 'center',
    marginTop: 5,       // Centrado óptimo en el círculo/cápsula del header
  },
});

export default AnimatedAlert;