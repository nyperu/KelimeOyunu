import React from 'react';
import {View, Text} from 'react-native';
import {AuthProvider} from './navigation/AuthProvider';
import Routes from './navigation/Routes';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';

PushNotification.createChannel(
  {
    channelId: "default-channel", // Kanal ID'si
    channelName: "Default Channel", // Kanal adı
  },
  (created) => console.log(`CreateChannel returned '${created}'`) // Kanal oluşturma durumu
);


const App = () => {
  return (
    <AuthProvider>
      <Routes />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </AuthProvider>
  );
};

export default App;
