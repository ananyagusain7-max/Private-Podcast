module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Keep plugins minimal; nativewind/babel is causing a Babel validation crash in this project.
    plugins: [
      // NOTE: expo-router/babel is deprecated; babel-preset-expo handles it, but leaving it out is fine.
      'react-native-reanimated/plugin',
    ],
  };
};
