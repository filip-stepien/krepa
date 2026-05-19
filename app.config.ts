import { ConfigContext, ExpoConfig } from 'expo/config';
import { withPlugins } from '@expo/config-plugins';
import withHealthConnect from './plugins/build/with-health-connect';

function defineConfig({ config }: ConfigContext): ExpoConfig {
    return {
        ...config,
        name: 'krepa',
        slug: 'krepa',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash-icon.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff'
        },
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                backgroundColor: '#E6F4FE',
                foregroundImage: './assets/android-icon-foreground.png',
                backgroundImage: './assets/android-icon-background.png',
                monochromeImage: './assets/android-icon-monochrome.png'
            },
            predictiveBackGestureEnabled: false,
            package: 'com.anonymous.krepa'
        },
        web: {
            favicon: './assets/favicon.png'
        },
        plugins: [
            [
                'expo-build-properties',
                {
                    android: {
                        compileSdkVersion: 36,
                        targetSdkVersion: 35,
                        minSdkVersion: 26
                    }
                }
            ]
        ]
    };
}

function withPluginsConfig(context: ConfigContext) {
    const config = defineConfig(context);

    return withPlugins(config, [
        [
            withHealthConnect,
            [
                { accessType: 'read', recordType: 'Steps' },
                { accessType: 'read', recordType: 'ActiveCaloriesBurned' }
            ]
        ]
    ]);
}

export default withPluginsConfig;
