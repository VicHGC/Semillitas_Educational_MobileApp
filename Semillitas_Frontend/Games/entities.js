import { Dimensions } from 'react-native';
import { Bee, Flower } from './renders.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default (activityData) => {
    
    // Coordenadas ORIGINALES que tenías
    // Nota: Como usamos 'bottom' en el render de la abeja, 
    // 250 significa "250 pixeles desde el suelo".
    const FINAL_LEFT = 250;
    const FINAL_BOTTOM = 250;

    return {
        // La Abeja
        bee: { 
            position: [50, 80], // Empieza abajo a la izquierda
            initialPosition: [50, 80],
            targetPosition: [FINAL_LEFT, FINAL_BOTTOM], // Vuela hacia arriba a la derecha
            size: [100, 100], // 📏 TAMAÑO ORIGINAL GRANDE
            assets: { imageUrl: activityData.imageUrl },
            progress: 0,
            renderer: Bee
        },
        
        // La Flor
        flower: {
            position: [220, 200], // Posición original
            size: [200, 200], // 📏 TAMAÑO ORIGINAL GRANDE
            assets: { backgroundImage: activityData.backgroundImage },
            renderer: Flower
        },
    };
};