import React, { useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { NavigationContainer, useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'

import ScanCodeScreen from '../screens/scanCodeScreen';
import EnterCodeScreen from '../screens/enterCodeScreen';
import HomeScreen from '../screens/homeScreen';
import PeopleList from '../screens/peopleListScreen';

function useRouteName() {
    const navigationState = useNavigationState(state => state);
    return navigationState?.routes[navigationState?.index]?.name;
  }

const HomeNavigator = () => {
    const currentRouteName = useRouteName();
    const Stack = createStackNavigator();
    const navigation = useNavigation();
    const navigationRef = useRef(null);

    const userListed = AsyncStorage.getItem("usersListed");

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (currentRouteName === 'HomeNavigator') {
                    BackHandler.exitApp();
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [currentRouteName])
    );

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
            } else if (navigationRef.current && (navigationRef.current.getCurrentRoute().name === 'EnterCodeScreen' || 
                        navigationRef.current.getCurrentRoute().name === 'ScanCodeScreen')) {
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