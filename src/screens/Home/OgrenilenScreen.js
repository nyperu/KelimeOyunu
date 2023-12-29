import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, ScrollView, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';


const App = () => {
  const [englishWord, setEnglishWord] = useState('');
  const [turkishWord, setTurkishWord] = useState('');
  const [nextId, setNextId] = useState(1);
  const [words, setWords] = useState([]);

   useEffect(() => {
    // Firestore'dan Words koleksiyonunu dinleyerek güncel verileri çekme
    const unsubscribe = firestore().collection('Words').orderBy('WordsId').onSnapshot(snapshot => {
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
      WordsId: nextId,
      WordsKnow: false,
      WordsNameEN: englishWord,
      WordsNameTR: turkishWord,
    });
    setEnglishWord('');
    setTurkishWord('');
    setNextId(prevNextId => prevNextId + 1);
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
      <Button title="Add Word" onPress={handleAddWord} />

      <ScrollView>
        {words.map((word, index) => (
          <Text key={index}>{word.WordsNameEN} - {word.WordsNameTR}</Text>
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