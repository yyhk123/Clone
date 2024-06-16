import {View, Text, ScrollView} from 'react-native'
import React from 'react'
import { rMS } from '../styles/responsive';

export default function MessageItem({message, currentUser}) {

    if (currentUser == message?.sender) {
        // my message
        return (
            <View className='flex-row justify-end mb-3 mr-3'>
                <View>
                    <Text>
                        {message?.text}
                    </Text>
                </View>
            </View>
        )
    }
    else {
        return (
            <View className='flex-row justify-end mb-3 mr-3'>
                <View>
                    <Text style={{color: 'blue', backgroundColor: 'yellow'}}>
                        {message?.text}
                    </Text>
                </View>
            </View>
        )
    }
}