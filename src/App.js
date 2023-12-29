import React from 'react';
import {View, Text} from 'react-native';
import {AuthProvider} from './navigation/AuthProvider';
import Routes from './navigation/Routes';


const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
