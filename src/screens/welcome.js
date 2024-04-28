import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {rMS, rV, rS} from '../styles/responsive'

export default function WelcomeScreen() {
    const navigation = useNavigation();
    const [fontLoaded, fontError] = useFonts({
        DMSans: require("../font/DMSans-VariableFont_opsz,wght.ttf")
    })

    const onLayoutRootView = useCallback(async() => {
        if(fontLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontLoaded, fontError]);

    if (!fontLoaded) {
        return null;
    }

    const handleLogInButton = () => {
        navigation.navigate('LoginScreen');
    };
    
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <View onLayout={onLayoutRootView} style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text>Welcome!</Text>
                </View>
                <Text>This is the home page.</Text>
                    <View style={styles.buttonContainer}>
                        <Button
                        title = {'Log In With Google'}
                            onPress={handleLogInButton}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: rMS(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
      marginBottom: 20,
    },
    buttonContainer: {
      marginTop: 20,
    },
  });