import React, { useState, useEffect } from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconFa from 'react-native-vector-icons/FontAwesome';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import OynaScreen from '../screens/Home/OynaScreen';
import ProfilScreen from '../screens/Home/ProfilScreen';
import OgrenilenScreen from '../screens/Home/OgrenilenScreen';
import Bilinmeyenler from '../screens/Home/Bilinmeyenler';
//import Icon from 'react-native-vector-icons/MaterialIcons';

// kullanıcı rolünü state'de saklıyoruz ve Firebase'den çekiyoruz



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabStack = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = firebase.firestore()
        .collection('Users')
        .doc(user.uid)
        .onSnapshot(doc => {
          if (doc.exists) 
          {
            setUserRole(doc.data().Role);
            console.log("Kullanıcının Rolü:", doc.data().role); // Rolü konsolda yazdır
          }
        });
      return () => unsubscribe();
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="OynaScreen"
      screenOptions={{
        tabBarActiveTintColor: '#f00',
        tabBarInactiveTintColor: '#111',
        style: {
          height: 70,
          backgroundColor: '#000',
          padding: 10,
        },
        tabBarLabelStyle: {
          textAlign: 'center',
          fontSize: 17,
        },
      }}>
        
      <Tab.Screen
        name="                       KELİME OYUNU"
        component={OynaScreen}
        options={{
          tabBarLabel: 'Oyna',
          // tabBarIcon: ({color, size}) => (
          //   <Icon name="home" color={color} size={size} />
          // ),
        }}
      />
{
userRole === 'Admin' && (
    <Tab.Screen
      name="ÖgrenilenScreen"
      component={OgrenilenScreen}
      options={{
        tabBarLabel: 'Öğrenilen',
        // tabBarIcon gibi diğer seçenekler
      }}
    />
  )
}


<Tab.Screen
        name="Bilinmeyenler"
        component={Bilinmeyenler}
       // options={{
         // tabBarLabel: 'Bilinmeyenler',
          //tabBarIcon: ({color, size}) => (
           // <IconFa name="exchange" color={color} size={size} />
         // ),
        //}}
      />
    

      

      <Tab.Screen
        name="ProfilScreen"
        component={ProfilScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="BottomTabStack">
      <Stack.Screen
        name="BottomTabStack"
        component={BottomTabStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
