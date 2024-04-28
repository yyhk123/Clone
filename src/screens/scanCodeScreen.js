'use strict';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import { useNavigation } from '@react-navigation/native';
import app from '../../auth/db/firestore';
import { getFirestore, collection, query, getDocs, where } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState();
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



  const getStore = async (data) => {
    await AsyncStorage.setItem('storeCode', data);

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
        navigation.navigate('PeopleList');
      } else {
        setErrorMessage('Please scan the code again.');
        console.log("Please scan again");
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
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
            }}
            style={StyleSheet.absoluteFillObject}
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
  },
});

export default ScanCodeScreen;