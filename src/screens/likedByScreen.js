import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, ActivityIndicator  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import app from '../../auth/db/firestore';
import { getFirestore, getDoc, doc } from '@firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../component/userCard';



const LikedByScreen = () => {
  const [likedByLists, setLikedByLists] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the index of the current user to display
  const [showUserCard, setShowUserCard] = useState(true);

  const navigation = useNavigation();
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLikedLists();
    });

    return unsubscribe;
  }, [navigation, currentIndex]);

  const getLikedLists = async () => {
    setCurrentIndex(0);
    console.log("get liked lists");
    setIsLoading(false);
    try {
      const savedUserId = await AsyncStorage.getItem("id");
      const docRef = doc(db, 'users', savedUserId);
      const docSnap = await getDoc(docRef);
      const likedBy = docSnap.data()['likedby'];
      console.log("likedBy: ", likedBy)
      setLikedByLists(likedBy);
      setIsLoading(false);
      return likedBy;
    } catch (error) {
      console.error('Error fetching likedBy list:', error);
      setIsLoading(false);
    }
  };

  const onNextUser = () => {
    if (currentIndex < likedByLists.length - 1) {
        setCurrentIndex(currentIndex + 1);
    } else {
        setCurrentIndex(likedByLists.length);
    }
  };

  const handleRefresh = () => {
    getLikedLists(); // Call the function to fetch liked by list again
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
            {showUserCard && currentIndex < likedByLists.length && <UserCard user={likedByLists[currentIndex]} onNextUser={onNextUser} />}
            {currentIndex === likedByLists.length && (
                <Text>No more lists</Text>
            )}
        </View>
        )}
        <Button title="Refresh" onPress={handleRefresh} />
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

export default LikedByScreen;