import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
//import { Icon } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

// Kelime bilgilerini saklamak için bir tip tanımı
interface WordDetail {
  id: string;
  WordsNameEN: string;
  WordsNameTR: string;
}

const LearnedWordsScreen = () => {
  const [learnedWordDetails, setLearnedWordDetails] = useState<WordDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteWords, setFavoriteWords] = useState(new Set()); // Favori kelimeleri tutacak state.
 // Favori durumunu toggle eden fonksiyon
 const toggleFavorite = (id: unknown) => {
  setFavoriteWords((prevFavorites) => {
    const newFavorites = new Set(prevFavorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    return newFavorites;
  });
};
  useEffect(() => {
    const fetchWords = async (wordIds: string[]) => {
      const words: WordDetail[] = [];
      for (const wordId of wordIds) {
        const wordDoc = await firestore().collection('Words').doc(wordId).get();
        if (wordDoc.exists) {
          const wordData = wordDoc.data();
          words.push({
            id: wordDoc.id,
            WordsNameEN: wordData?.WordsNameEN || 'No English translation',
            WordsNameTR: wordData?.WordsNameTR || 'No Turkish translation',
          });
        }
      }
      setLearnedWordDetails(words);
      setLoading(false);
    };

    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.log('Kullanıcı girişi yapılmamış!');
      setLoading(false);
      return;
    }

    const subscriber = firestore()
      .collection('Users')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data();
          const wordIds: string[] = userData?.learnedWords || [];
          fetchWords(wordIds);
        } else {
          console.log('Kullanıcı verisi bulunamadı!');
          setLoading(false);
        }
      });

    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderItem = ({ item }: { item: WordDetail }) => {
    // Kelimenin favori olup olmadığını kontrol et
    const isFavorite = favoriteWords.has(item.id);
    return (
      <View style={styles.item}>
      <Text style={styles.text}>{item.WordsNameEN} - {item.WordsNameTR}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        {/* <Icon
          name={isFavorite ? 'star' : 'star-o'} // Favori ise dolu yıldız, değilse boş yıldız.
          size={24}
          color={isFavorite ? 'yellow' : 'grey'} // Favori ise sarı renk, değilse gri renk.
        /> */}
      </TouchableOpacity>
    </View>
  );
};

  return (
    <FlatList
      data={learnedWordDetails}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#e6f7ff', // Açık mavi arka plan rengi
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10, // Yuvarlatılmış köşeler
    shadowColor: '#000', // Gölge efekti için
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 20, // Daha büyük yazı tipi boyutu
    color: '#0057b7', // Canlı mavi yazı rengi
    fontWeight: 'bold', // Kalın yazı tipi
  },
});

export default LearnedWordsScreen;
