import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import FlipCardComponent from '../../component/FlipCardComponent';
import firestore from '@react-native-firebase/firestore';

interface Fruit {
  id: string;
  WordsId: number;
  WordsKnow: boolean;
  WordsNameEN: string;
  WordsNameTR: string;
}

const App = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);

  useEffect(() => {
    const subscriber = firestore().collection('Words').onSnapshot(querySnapshot => {
      const fruits = querySnapshot.docs.map(documentSnapshot => {
        const fruitData = documentSnapshot.data();
        return {
          id: documentSnapshot.id,
          WordsId: fruitData.WordsId, // Firestore'dan gelen WordsId
          WordsKnow: fruitData.WordsKnow, // Firestore'dan gelen WordsKnow
          WordsNameEN: fruitData.WordsNameEN, // Firestore'dan gelen WordsNameEN
          WordsNameTR: fruitData.WordsNameTR, // Firestore'dan gelen WordsNameTR
        };
      });
      setFruits(fruits);
    });
  
    return () => subscriber();
  }, []);

  const fetchRandomFruit = async () => {
    // Tüm 'WordsKnow' değeri false olan dokümanları getirin
    const querySnapshot = await firestore()
      .collection('Words')
      .where('WordsKnow', '==', false)
      .get();
  
    const docs = querySnapshot.docs.filter(doc => !doc.data().WordsKnow);
    if (docs.length > 0) {
      // Rastgele bir indeks seç
      const randomIndex = Math.floor(Math.random() * docs.length);
      // Rastgele seçilen dokümanı al
      const doc = docs[randomIndex];
      return {
        id: doc.id,
        WordsId: doc.data().WordsId,
        WordsKnow: doc.data().WordsKnow,
        WordsNameEN: doc.data().WordsNameEN,
        WordsNameTR: doc.data().WordsNameTR,
      };
    } else {
      // Eğer uygun doküman yoksa, null döndür
      return null;
    }
  };
  

  const handleFlipEnd = async (id: string) => {
    // Çıkarılan kartın index'ini bul
    const index = fruits.findIndex(fruit => fruit.id === id);
  
    // Yeni meyve ekleyin
    const newFruit = await fetchRandomFruit();
  // Eğer yeni meyve varsa, listeyi güncelleyin
  if (newFruit) {
    setFruits(currentFruits => {
      // Mevcut meyvelerin bir kopyasını alın
      let newFruits = [...currentFruits];
      // Yeni meyveyi eski meyvenin index'ine yerleştirin
      newFruits[index] = newFruit;
      // Güncellenmiş meyve listesini döndürün
      return newFruits;
    });
  } else {
    // Uygun yeni meyve bulunamadıysa, mevcut listeyi güncellemeden bırakın
    console.log('Uygun yeni meyve bulunamadı.');
  }
   
    
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {fruits.map(fruit => (
          <FlipCardComponent
            key={fruit.id}
            id={fruit.WordsId.toString()}
            frontText={fruit.WordsNameEN}
            backText={fruit.WordsNameTR}
            onFlipEnd={() => handleFlipEnd(fruit.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default App;
