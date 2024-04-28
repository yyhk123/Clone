import React, { useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'

import ScanCodeScreen from '../screens/scanCodeScreen';
import EnterCodeScreen from '../screens/enterCodeScreen';
import HomeScreen from '../screens/homeScreen';
import PeopleList from '../screens/peopleListScreen';

const HomeNavigator = () => {
    const Stack = createStackNavigator();
    const navigation = useNavigation();
    const navigationRef = useRef(null);
    console.log("User at homenavigator")

    const userListed = AsyncStorage.getItem("usersListed");

    useEffect(() => {
        const focusListener = () => {
            console.log('HomeNavigator focused, do something...');
        };
        // Add the focus listener
        const unsubscribe = navigation.addListener('focus', focusListener);
        
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (navigationRef.current && (navigationRef.current.getCurrentRoute().name === 'PeopleList' && userListed === 'true')
            ) {
                BackHandler.exitApp();
                return true;
            } else if (navigationRef.current && (navigationRef.current.getCurrentRoute().name === 'ScanCode' || 
            navigationRef.current.getCurrentRoute().name === 'EnterCode')) {
                navigationRef.current.navigate('HomeScreen')
                return true;
            }
            return false;
        });
        
        return () => backHandler.remove();
    }, [navigationRef]);

    return (
        <NavigationContainer ref={navigationRef} independent={true}>
            <Stack.Navigator initialRouteName="HomeScreen" >
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ScanCodeScreen" component={ScanCodeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EnterCodeScreen" component={EnterCodeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PeopleList" component={PeopleList} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default HomeNavigator;