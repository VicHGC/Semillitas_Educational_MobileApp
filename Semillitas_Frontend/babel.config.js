module.exports = function(api) {
      api.cache(true);
      return {
        presets: ['babel-preset-expo'],
        plugins: [
          // 
          // ... otros plugins que puedas tener
          //
          // IMPORTANTE: reanimated DEBE ser el ÚLTIMO plugin
          'react-native-reanimated/plugin',
        ],
      };
    };