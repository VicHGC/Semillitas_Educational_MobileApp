import React from 'react';
import { Image } from 'react-native';

const Bee = (props) => {
    const { position, assets, size } = props; 
    
    // Restauramos el tamaño grande original si no viene en props
    const width = size ? size[0] : 100;
    const height = size ? size[1] : 100;

    if (!assets?.imageUrl) return null;

    return (
        <Image
            source={{ uri: assets.imageUrl }}
            style={{
                width: width,
                height: height,
                resizeMode: 'contain',
                position: 'absolute',
                left: position[0], 
                // REGRESAMOS A 'bottom' COMO LO TENÍAS ANTES
                // Esto hace que al aumentar el número Y, la abeja suba.
                bottom: position[1], 
            }}
        />
    );
};

const Flower = (props) => {
    const { position, assets, size } = props;
    
    // Restauramos el tamaño gigante de la flor
    const width = size ? size[0] : 200;
    const height = size ? size[1] : 200;

    if (!assets?.backgroundImage) return null;
    
    return (
        <Image
            source={{ uri: assets.backgroundImage }}
            style={{
                width: width,
                height: height,
                resizeMode: 'contain',
                position: 'absolute',
                left: position[0],
                top: position[1], // La flor usaba top en tu código original
            }}
        />
    );
};

export { Bee, Flower };