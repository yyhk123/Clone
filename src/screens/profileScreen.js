import { View, Text, StyleSheet, BackHandler } from 'react-native';
import React from 'react';
import { useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

function useRouteName() {
    const navigationState = useNavigationState(state => state);
    return navigationState?.routes[navigationState?.index]?.name;
}

const ProfileScreen = () => {
    const currentRouteName = useRouteName();

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (currentRouteName === 'ProfileScreen') {
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
      
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text>Profile screen</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ProfileScreen;