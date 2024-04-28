import React, {useState, useEffect, useRef} from 'react';
import { View, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PeopleList from './peopleListScreen';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const [codeScanned, setCodeScanned] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const getCodeFromStorage = async () => {
        try {
            const code = await AsyncStorage.getItem('storeCode');
            if (code !== null) {
                setCodeScanned(code);
            }
            else{
                setCodeScanned(null);
            }
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCodeFromStorage();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return(
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {codeScanned ? (
                    <PeopleList />
                ) : (
                    <View style={styles.buttonContainer}>
                    <Button
                        title="Scan Code"
                        onPress={() => navigation.navigate('ScanCodeScreen')}
                    />
                    <Button
                        title="Enter Code"
                        onPress={() => navigation.navigate('EnterCodeScreen')}
                    />
                    </View>
                )}
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

export default HomeScreen;