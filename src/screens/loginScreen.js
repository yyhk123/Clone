import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import app from '../../auth/db/firestore';
import { getFirestore, collection, query, getDocs, where, getDoc, doc } from '@firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';


const LogIn = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState('');

  const db = getFirestore(app);
  const navigation = useNavigation();

  const findUser = async () => {
    try {
      if (email === '') {
        return ;
      }
      console.log("get user initated, email: ", email)
      const usersRef = collection(db, 'users'); 
      const q = query(usersRef, where('email', '==', email));
      console.log(q);

      const querySnapshot = await getDocs(q);
      const existingUser = querySnapshot.empty ? null : querySnapshot.docs[0].data();
      console.log("existing user: ", existingUser);
      if (existingUser) {
        setUser(existingUser);
        storeUser(existingUser.email);
        navigation.navigate("HomeTabs");
      }
      else {
        setEmailError("User not found");
      }

    } catch(e) {
      console.log("error message: ", e.message);
    }
  }

  const storeUser = async (value) => {
    try {
      await AsyncStorage.setItem('email', value);
      const usersRef = collection(db, 'users'); 
      const q = query(usersRef, where('email', '==', value));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'users', userDoc.id);
      await AsyncStorage.setItem('id', userDoc.id);

      const userDocSnap = await getDoc(userRef);
      const userData = userDocSnap.data();
      const userName = userData.name;

      await AsyncStorage.setItem('name', userName);
      await AsyncStorage.removeItem('storeCode');
      console.log("Async stored email: ", value, " id: ", userDoc.id)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findUser();
  }, [])

  const handleLogin = async () => {
    setEmailError('')
  
    if ('' === email) {
      setEmailError('Please enter your email');
    }

    try {
      await findUser(email);
    }
    catch(err) {
      setError(err.message);
    }
  }


  const handleLoginPress = () => {
    try {
      return async () => {
        await handleLogin(email);
      };
    }
    catch (err) {
      setError(err.message); // Handle potential errors during login
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text>
            Please Log In
            {"\n"}
            Connect with Google
          </Text>
        </View>
        <Text>
          {"\n"}
        </Text>
        <View>
          <TextInput
            value={email}
            placeholder="Enter your email here"
            onChangeText={(val) => setEmail(val)}
            className={'inputBox'}
            />
          <Text className="errorLabel">{emailError}</Text>
        </View>
        <Text>
          {"\n"}
        </Text>
        <View>
          <Button title={'Log in'} onPress={handleLoginPress()} />
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 20,
  },
});

export default LogIn;