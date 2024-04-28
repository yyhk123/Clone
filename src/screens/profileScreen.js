import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
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
    titleContainer: {
      marginBottom: 20,
    },
    buttonContainer: {
      marginTop: 20,
    },
  });

export default ProfileScreen;