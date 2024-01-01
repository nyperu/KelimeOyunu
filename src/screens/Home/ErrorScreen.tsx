import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorScreen = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Hata</Text>
        <Text style={styles.errorMessage}>Bu sayfaya erişiminiz yok.</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fdd',
      padding: 20,
    },
    errorTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'red',
    },
    errorMessage: {
      fontSize: 18,
      color: 'black',
      marginTop: 20,
    },
  });
  
  export default ErrorScreen;