import React, { useEffect, useState, } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler
} from 'react-native';
import { Camera, CameraType, CameraView } from "expo-camera/next";
import { useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import app from '../../auth/db/firestore';
import { getFirestore, collection, query, getDocs, where } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

function useRouteName() {
  const navigationState = useNavigationState(state => state);
  console.log("userRouteName: ", navigationState?.routes[navigationState?.index]?.name);
  return navigationState?.routes[navigationState?.index]?.name;
}

const ScanCodeScreen = () => {
  const currentRouteName = useRouteName();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [store, setStore] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const db = getFirestore(app);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const { height, width } = Dimensions.get('window');

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (currentRouteName === 'ScanCodeScreen') {
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

  const goBackToHome = () => {
    navigation.navigate('HomeScreen'); // Navigate to the Home tab
  };


  const getStore = async (data) => {
    console.log("getSrore code: ", data)
    try {
      const storeRef = collection(db, 'stores');
      const q = query(storeRef, where('storeCode', '==', data));
      const querySnapshot = await getDocs(q);

      const storeList = [];
      querySnapshot.forEach((doc) => {
        storeList.push(doc.data());
      });
      console.log(storeList)

      setStore(storeList);
      if (storeList.length > 0) {
        console.log("Code scanned: ", data);
        await AsyncStorage.setItem('storeCode', data);
        navigation.navigate('PeopleList');
      } else {
        setErrorMessage('Please scan the code again.');
        console.log("Please scan again");
        setScanned(false);
        setScannedCode("");
        await AsyncStorage.removeItem('storeCode')
      }
    } catch(error) {
      console.log(error);
    }
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedCode(data);
    console.log("code scanned: ", data);
    getStore(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[styles.camera, { height: height, width: width }]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  camera: {
    flex: 1,
  },
});

export default ScanCodeScreen;