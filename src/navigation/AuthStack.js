import React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabStack = () => {
  return (
    <Tab.Navigator
    initialRouteName="LoginScreen"
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
          fontSize: 18,
        },
      }}>
    
      <Tab.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          tabBarLabel: 'Giriş',
          tabBarIcon: ({color, size}) => (
            <Icon name="user-shield" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          tabBarLabel: 'Yeni Üyelik',
          tabBarIcon: ({color, size}) => (
            <Icon name="user-plus" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          tabBarLabel: 'Şifre Sıfırla',
          tabBarIcon: ({color, size}) => (
            <Icon name="key" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const AuthStack = () => {
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

export default AuthStack;
