import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, BackHandler } from 'react-native';
import { useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import app from '../../auth/db/firestore';
import { getFirestore, collection, query, getDocs, where } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// 코드 입력후 db 에 유저-storeCode 도 업데이트 해야함.

function useRouteName() {
  const navigationState = useNavigationState(state => state);
  return navigationState?.routes[navigationState?.index]?.name;
}

const EnterCodeScreen = () => {
  const currentRouteName = useRouteName();

  const [code, setCode] = useState('');
  const [store, setStore] = useState([]);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const db = getFirestore(app);

  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            if (currentRouteName === 'EnterCodeScreen') {
                goBackToHome();
                return true;
            } else {
                return false;
            }
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [currentRouteName])
  );
    

  const getStore = async () => {
    setIsLoading(true); 
    try {
      await AsyncStorage.setItem('storeCode', code);

      const storeRef = collection(db, 'stores');
      console.log("entering getUsers from enterCode");
      const q = query(storeRef, where('storeCode', '==', code));

      const querySnapshot = await getDocs(q);

      const storeList = [];
      querySnapshot.forEach((doc) => {
        storeList.push(doc.data());
      });

      setStore(storeList);
      setIsLoading(false);
      if (storeList.length === 0) {
        setErrorMessage('Please check the code again.');
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      setErrorMessage('Error fetching store. Please try again.');
      setIsLoading(false); 
    }
  };

  const goBackToHome = () => {
    navigation.navigate('HomeScreen'); // Navigate to the Home tab
  };

  useEffect(() => {
      if (store.length > 0) {
          setIsLoading(true);
          navigation.navigate('PeopleList');
      }
  }, [store]);

  const handleSubmit = () => {
      getStore();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <TextInput
          style={styles.input}
          value={code}
          onChangeText={(newCode) => setCode(newCode)}
          placeholder="Enter code"
          placeholderTextColor="#888"
          autoCapitalize="none"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
          selectTextOnFocus={!isLoading} 
          />
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    titleContainer: {
        marginBottom: 20,
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        width: '100%',
    },
});

export default EnterCodeScreen;