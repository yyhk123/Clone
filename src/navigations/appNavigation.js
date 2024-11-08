import { View, Text, BackHandler } from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import { NavigationContainer, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from '../screens/welcome';
import ChatListScreen from '../screens/chatListScreen';
import ChatDetailScreen from '../screens/chatDetailScreen';
import HomeNavigator from './homeNavigator';
import LikedByScreen from '../screens/likedByScreen';
import ProfileScreen from '../screens/profileScreen';
import LoginScreen from '../screens/loginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// https://www.youtube.com/watch?v=x9XbqVbzET8&ab_channel=TechRated
// https://github.com/joestackss/Dating-App-UI-React-Native/blob/main/src/screens/ChatDetailsScreen.js
// npm run android (create android folder)
  
const HomeTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName='HomeNavigator'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused }) => null,
                tabBarLabel: ({ focused }) => <CustomTabBarLabel label={route.name} focused={focused} />,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 50,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            })}>
            <Tab.Screen name="HomeNavigator" component={HomeNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ color: focused ? '#000000' : '#748c94', fontSize: 14, fontWeight: focused ? 'bold' : 'normal' }}>Home</Text>
                    )
                }}
            />
            <Tab.Screen name="LikedByScreen" component={LikedByScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ color: focused ? '#000000' : '#748c94', fontSize: 14, fontWeight: focused ? 'bold' : 'normal' }}>Liked By</Text>
                    )
                }}
            />
            <Tab.Screen name="ChatListScreen" component={ChatListScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ color: focused ? '#000000' : '#748c94', fontSize: 14, fontWeight: focused ? 'bold' : 'normal' }}>Chat</Text>
                    )
                }}
            />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ color: focused ? '#000000' : '#748c94', fontSize: 14, fontWeight: focused ? 'bold' : 'normal' }}>Profile</Text>
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigation() {
    return (
        <NavigationContainer>
             <StatusBar
                animated={true}
                // backgroundColor="#2e2e2e"
                style="auto"
                hidden={false}
            />
            <Stack.Navigator
                initialRouteName='WelcomeScreen'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='WelcomeScreen' component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='ChatDetailScreen'
                    component={ChatDetailScreen}
                    options={{ headerShown: false, presentation: 'modal' }}
                />
                <Stack.Screen name='HomeTabs' component={HomeTabs} options={{ headerShown: false }} />
                <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

