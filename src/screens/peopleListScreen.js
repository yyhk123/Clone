import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import app from '../../auth/db/firestore';
import UserCard from '../component/userCard';
import { getFirestore, collection, query, getDocs, where, getDoc, doc, updateDoc } from '@firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const PeopleList = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [users, setUsers] = useState({});
    const [storeCode, setStoreCode] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0); // State to track the index of the current user to display
    const [showUserCard, setShowUserCard] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const db = getFirestore(app);
    console.log("in peoplelist screen")

    const getAndSetStoreCode = async () => {
      const savedStoreCode = await AsyncStorage.getItem("storeCode");
      setStoreCode(savedStoreCode);
      if (savedStoreCode) {
        await getUsers(savedStoreCode); // Fetch users only if storeCode exists
      }
      setIsLoading(false);
    };

    const handleResetCode = async () => {
      setStoreCode(null);
      setUsers({});
      setCurrentIndex(0);
      setIsLoading(true);
      await AsyncStorage.setItem('usersListed', 'false');
      const savedUserId = await AsyncStorage.getItem("id");
      try {
        const userDocRef = doc(db, 'users', savedUserId);
        await updateDoc(userDocRef, { storeCode: "" });
      } catch (error) {
        console.log(error);
      }
      await AsyncStorage.removeItem("storeCode");
      navigation.navigate('HomeScreen');
    };

    const setStoreCodeToUser = async () => {
      const savedUserId = await AsyncStorage.getItem("id");
      try {
        const userDocRef = doc(db, 'users', savedUserId);
        await updateDoc(userDocRef, { storeCode: storeCode });
      } catch (error) {
        console.log(error);
      }
    };

    const refresh = async() => {
      setUsers([]);
      setIsLoading(true);
      await getUsers(storeCode);
    };
    

    const getUsers = async (code) => {
      console.log("storeCode from getUsers",storeCode)
      try {
        // get all users in the same StoreCode
        const savedUserId = await AsyncStorage.getItem("id");
        const savedUser = await AsyncStorage.getItem("email");
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('storeCode', '==', code));
        const querySnapshot = await getDocs(q);
        const allUsers = querySnapshot.docs.map(doc => doc.data());
        const filteredUsers = allUsers.filter(owner => owner.email !== savedUser); // remove owner's info from all users list

        setCurrentIndex(0);

        // list of likes for users.
        const docRef = doc(db, 'users', savedUserId);
        const docSnap = await getDoc(docRef);
        const likesList = docSnap.data()['likes'];
        const chatsWith = docSnap.data()['chatsWith'];

        // filter users in 'likes'
        const filteredLikes = filteredUsers.filter(obj => !likesList.includes(obj.email));

        // filter users in 'chatsWith'
        const usersList = filteredLikes.filter(obj => !chatsWith.includes(obj.email));

        setUsers(usersList);
        await AsyncStorage.setItem('usersListed', 'true');
        
        return usersList;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };


    useEffect(() => {
      Promise.all([getAndSetStoreCode(), setStoreCodeToUser(), getUsers(storeCode)])
        .then(() => console.log('Data fetched successfully'))
        .catch(error => console.error('Error fetching data:', error));
    }, [storeCode, isLoading]);

    const onNextUser = () => {
      if (currentIndex < users.length - 1) {
          setCurrentIndex(currentIndex + 1);
      } else {
          setCurrentIndex(users.length);
      }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            {isLoading ? (
                <View>
                <ActivityIndicator size="large" color={'#000000'} />
                <Text>Loading...</Text>
                </View>
            ) : (
                <View>
                {showUserCard && currentIndex < users.length && <UserCard user={users[currentIndex]} onNextUser={onNextUser} />}
                {currentIndex === users.length && (
                    <Button
                        title="Refresh"
                        onPress={refresh}
                    />
                )}
                <Button title="Reset" onPress={handleResetCode} />
                {users.length === 0 && (
                    <Text style={styles.noUsersText}>No more users to show</Text>
                )}
            </View>
            )}
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default PeopleList;