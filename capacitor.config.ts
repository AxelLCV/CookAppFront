import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weekcook.weekcook',
  appName: 'Weekcook',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffff',
    },
    StatusBar: {
      style: 'light',
    },
    CapacitorUpdater: {
      version: '0.0.0',
      autoUpdate: 'off',
    },
  },
};

export default config;
