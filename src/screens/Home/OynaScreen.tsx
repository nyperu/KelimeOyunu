import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import FlipCardComponent from '../../component/FlipCardComponent';
import firestore from '@react-native-firebase/firestore';
import firebase from 'firebase/compat/app';
import  User  from '@react-native-firebase/auth';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';// Firebase auth import edilir.



interface Word {
  id: string;
  WordsNameEN: string;
  WordsNameTR: string;
}

const App = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [targetWord, setTargetWord] = useState<Word | null>(null);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    
      // Kullanıcı oturum durumu dinleyicisi.
      const userSubscriber = auth().onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
        setCurrentUser(user);
      });
        // Kullanıcının öğrendiği kelimeleri Firestore'dan çek
  const currentUser = auth().currentUser;
  if (!currentUser) return;

  const unsubscribe = firestore()
    .collection('Users')
    .doc(currentUser.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        setLearnedWords(userData.learnedWords || []);
      }
    });
// Firestore'dan Words koleksiyonunu dinle
    
     // Firestore'dan Words koleksiyonunu dinle
     const wordsSubscriber = firestore().collection('Words').onSnapshot(querySnapshot => {
      const fetchedWords = querySnapshot.docs.map(documentSnapshot => {
        return {
          id: documentSnapshot.id,
          WordsNameEN: documentSnapshot.data().WordsNameEN,
          WordsNameTR: documentSnapshot.data().WordsNameTR
        };
      });
// Öğrenilmemiş kelimeleri filtrele
//const unlearnedWords = fetchedWords.filter(word => !learnedWords.includes(word.id));
// Ekranda gösterilecek 12 kelimeyi seç
const wordsToShow = fetchedWords.length > 12 ? fetchedWords.slice(0, 12) : fetchedWords;

  
    

      setAvailableWords(fetchedWords);
      setWords(wordsToShow);
      pickNewTargetWord(wordsToShow);
    });

    // Cleanup fonksiyonları.
    return () => {
      userSubscriber();
      wordsSubscriber();
    };
  }, []);

  const pickNewTargetWord = (wordList: string | any[]) => {
    setTargetWord(wordList[Math.floor(Math.random() * wordList.length)]);
  };

 
  const handleFlipEnd = async (id: string): Promise<boolean> => {
    // Hedef kelime ve mevcut kullanıcı var mı ve kart ID'si hedef kelime ile eşleşiyor mu kontrol et
    if (targetWord && id === targetWord.id && currentUser) {
      // Firestore'da mevcut kullanıcının öğrendiği kelimeler listesini güncelle
      await firestore().collection('Users').doc(currentUser.uid).update({
        learnedWords: firestore.FieldValue.arrayUnion(id)
      });
  
      // Ekranda gösterilen kartları güncelle ve yeni bir targetWord seç
      replaceWordInDisplay(id, () => {
                      const remainingWords = words.filter(word => word.id !== id);
                     pickNewTargetWord(remainingWords); // Yeni targetWord seç
                    });
      const remainingWords = words.filter(word => word.id !== id);
      pickNewTargetWord(remainingWords);
      return true; // Doğru bilindi
    } else {
      // Yanlış bilindi, kullanıcının öğrenemediği kelimeler listesine ekleyin
      if (currentUser) {
        await firestore().collection('Users').doc(currentUser.uid).update({
          unLearnedWords: firestore.FieldValue.arrayUnion(id)
        });
      }
      // Bu işlevsellik FlipCardComponent tarafından sağlanmalıdır.
      return false; // Yanlış bilindi
    }
  };
  
  
  
const replaceWordInDisplay = (id: string) => {
  setWords(currentWords => {
    const index = currentWords.findIndex(word => word.id === id);
    // Kelimeyi mevcut listeden çıkar
    let newWords = [...currentWords];
    if (index !== -1) newWords.splice(index, 1);

    // Henüz gösterilmemiş ve öğrenilmemiş kelimeleri filtrele
    const unlearnedWords = availableWords.filter(
      word => !newWords.includes(word) && !learnedWords.includes(word.id)
    );

    // Eğer varsa, rastgele yeni bir kelime ekle
    if (unlearnedWords.length > 0) {
      const newWord = unlearnedWords[Math.floor(Math.random() * unlearnedWords.length)];
      newWords.splice(index, 0, newWord); // Yeni kelimeyi listeye ekle
    }

    return newWords;
  });
};

  // const replaceWordInDisplay = (id: string, callback: { (): void; (): any; }) => {
  //   setWords(currentWords => {
  //     const index = currentWords.findIndex(word => word.id === id);
  //     let newWords = [...currentWords];
  //     newWords.splice(index, 1);// Ekrandan kelimeyi çıkar

  //     const remainingWords = availableWords.filter(word => !newWords.includes(word));
  //     if (remainingWords.length > 0) {
  //       const newWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
  //       newWords.splice(index, 0, newWord);// Yeni kelimeyi aynı indekse ekle
  //     }

  //     // State güncellemesi tamamlandıktan sonra callback fonksiyonu çağrılabilir
  //   callback?.();
  //     return newWords;
  //   });
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles2.text}>
         {targetWord ? targetWord.WordsNameTR : 'Loading...'}
      </Text>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {words.map((word) => (
          <FlipCardComponent
            key={word.id}
            id={word.id}
            frontText={word.WordsNameEN}
            backText={word.WordsNameTR}
            onFlipEnd={() => handleFlipEnd(word.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  targetWord: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
});
const styles2 = StyleSheet.create({
  text: {
    fontSize: 24,             // Yazı boyutu
    fontWeight: 'bold',       // Yazı kalınlığı
    color: '#FFFFFF',         // Yazı rengi
    backgroundColor: '#4CAF50', // Arka plan rengi, örneğin yeşil tonu
    padding: 10,              // İç boşluk
    borderRadius: 6,          // Kenar yuvarlaklığı
    overflow: 'hidden',       // Taşan içeriği kes
    textAlign: 'center',      // Metni ortala
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Metin gölgesinin rengi
    textShadowOffset: { width: -1, height: 1 }, // Metin gölgesinin yönü
    textShadowRadius: 10      // Metin gölge yarıçapı
  }
});

export default App;
