import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const FloatingElements = () => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;
  const anim5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue, duration = 3000, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(anim1, 4000, 0).start();
    createAnimation(anim2, 5000, 500).start();
    createAnimation(anim3, 4500, 1000).start();
    createAnimation(anim4, 3500, 1500).start();
    createAnimation(anim5, 5500, 2000).start();
  }, []);

  const getTranslateY = (anim) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -20],
    });
  };

  const getTranslateX = (anim) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 15],
    });
  };

return (
    <View style={styles.container} pointerEvents="none">
      {/* ⭐ Estrella 1 */}
      <Animated.View
        style={[
          styles.element,
          styles.star1,
          { transform: [{ translateY: getTranslateY(anim1) }, { translateX: getTranslateX(anim1) }] },
        ]}
      >
        <Image 
          source={require('./assets/SelectTheGame/stars.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* 🌟 Estrella 2 (Más grande) */}
      <Animated.View
        style={[
          styles.element,
          styles.star2,
          { transform: [{ translateY: getTranslateY(anim2) }, { translateX: getTranslateX(anim2) }] },
        ]}
      >
        <Image 
          source={require('./assets/SelectTheGame/stars.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* ☁️ Nube 1 */}
      <Animated.View
        style={[
          styles.element,
          styles.cloud1,
          { transform: [{ translateY: getTranslateY(anim3) }, { translateX: getTranslateX(anim3) }] },
        ]}
      >
        <Image 
          source={require('./assets/SelectTheGame/butterfly.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* 🌸 Flor 1 (Cherry Blossom) */}
      <Animated.View
        style={[
          styles.element,
          styles.flower1,
          { transform: [{ translateY: getTranslateY(anim4) }, { translateX: getTranslateX(anim4) }] },
        ]}
      >
        <Image 
          source={require('./assets/SelectTheGame/flower.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* 🦋 Mariposa 1 */}
      <Animated.View
        style={[
          styles.element,
          styles.butterfly1,
          { transform: [{ translateY: getTranslateY(anim5) }, { translateX: getTranslateX(anim5) }] },
        ]}
      >
        <Image 
          source={require('./assets/SelectTheGame/butterfly.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* ✨ Estrella 3 */}
      <View style={[styles.element, styles.star3]}>
        <Image 
          source={require('./assets/SelectTheGame/stars.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </View>

      {/* 🌺 Flor 2 (Hibiscus) */}
      <View style={[styles.element, styles.flower2]}>
        <Image 
          source={require('./assets/SelectTheGame/flower.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </View>

      {/* ☀️ Sol */}
      <View style={[styles.element, styles.sun]}>
        <Image 
          source={require('./assets/SelectTheGame/sun.png')} 
          style={styles.floatingImage} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  element: {
    position: 'absolute',
  },
  emoji: {
    fontSize: 30,
  },
  star1: {
    top: '10%',
    left: '15%',
  },
  star2: {
    top: '25%',
    right: '20%',
  },
  star3: {
    top: '45%',
    left: '8%',
  },
  cloud1: {
    top: '5%',
    right: '10%',
  },
  flower1: {
    bottom: '30%',
    left: '12%',
  },
  flower2: {
    bottom: '15%',
    right: '15%',
  },
  butterfly1: {
    top: '35%',
    left: '25%',
  },
  sun: {
    top: '15%',
    right: '35%',
  },
  floatingImage: {
    width: 60,
    height: 60,
  },
});

export default FloatingElements;