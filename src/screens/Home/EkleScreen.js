import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, ScrollView, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';
const App = () => {
  const [englishWord, setEnglishWord] = useState('');
  const [turkishWord, setTurkishWord] = useState('');
  const [words, setWords] = useState([]);

  const sendLocalNotification = () => {
    PushNotification.localNotification({
      channelId: "default-channel",
      title: "Yeni Kelime Eklendi",
      message: ` Yeni kelime eklendi, şimdi keşfet!`,
    });
  };
  // Toast mesajını göster

  // const sendLocalNotification = () => {
  //   PushNotification.localNotification({
  //     title: "Yeni Kelime Eklendi",
  //     message: ` Yeni kelime eklendi, şimdi keşfet!`, // Örnek mesaj
  //   });
  
  // };

  useEffect(() => {
    // Firestore'dan Words koleksiyonunu dinleyerek güncel verileri çekme
    const unsubscribe = firestore().collection('Words').onSnapshot(snapshot => {
      const wordsList = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      setWords(wordsList);
    });
    return () => unsubscribe();
  }, []);

  const handleAddWord = () => {
    
    firestore().collection('Words').add({
      WordsNameEN: englishWord,
      WordsNameTR: turkishWord
    });
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Yeni Kelime Eklendi',
      text2: 'Bir yeni kelime başarıyla eklendi, şimdi keşfet!',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40
    });
    sendLocalNotification();
    setEnglishWord('');
    setTurkishWord('');
   
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEnglishWord}
        value={englishWord}
        placeholder="Enter an English word"
      />
      <TextInput
        style={styles.input}
        onChangeText={setTurkishWord}
        value={turkishWord}
        placeholder="Enter its Turkish translation"
      />
      <Button 
       title="Add Word" 
       onPress={handleAddWord} 
       disabled={!englishWord || !turkishWord} // Buton, her iki input da boş olmadığında aktif olur

       />

      <ScrollView>
        {words.map((word, index) => (
          <Text key={word.id}>{word.WordsNameEN} - {word.WordsNameTR}</Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
