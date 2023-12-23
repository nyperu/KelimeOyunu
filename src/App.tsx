import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import FlipCardComponent from '../FlipCardComponent'; // FlipCardComponent'in import edildiği yer

// Meyve objesi için bir tip tanımlaması
interface Fruit {
  id: string;
  en: string;
  tr: string;
}
// Tüm meyvelerin listesi
const allFruits: Fruit[] =[
  // ... 30 meyve içeren allFruits dizisi
  
    { id: 'apple', en: 'Apple', tr: 'Elma' },
    { id: 'banana', en: 'Banana', tr: 'Muz' },
    { id: 'orange', en: 'Orange', tr: 'Portakal' },
    { id: 'strawberry', en: 'Strawberry', tr: 'Çilek' },
    { id: 'grape', en: 'Grape', tr: 'Üzüm' },
    { id: 'cherry', en: 'Cherry', tr: 'Kiraz' },
    { id: 'watermelon', en: 'Watermelon', tr: 'Karpuz' },
    { id: 'peach', en: 'Peach', tr: 'Şeftali' },
    { id: 'pear', en: 'Pear', tr: 'Armut' },
    { id: 'pineapple', en: 'Pineapple', tr: 'Ananas' },
    { id: 'mango', en: 'Mango', tr: 'Mango' },
    { id: 'blueberry', en: 'Blueberry', tr: 'Yaban Mersini' },
    { id: 'kiwi', en: 'Kiwi', tr: 'Kivi' },
    { id: 'lemon', en: 'Lemon', tr: 'Limon' },
    { id: 'lime', en: 'Lime', tr: 'Lime' },
    { id: 'papaya', en: 'Papaya', tr: 'Papaya' },
    { id: 'raspberry', en: 'Raspberry', tr: 'Ahududu' },
    { id: 'blackberry', en: 'Blackberry', tr: 'Böğürtlen' },
    { id: 'coconut', en: 'Coconut', tr: 'Hindistan Cevizi' },
    { id: 'fig', en: 'Fig', tr: 'İncir' },
    { id: 'guava', en: 'Guava', tr: 'Guava' },
    { id: 'lychee', en: 'Lychee', tr: 'Liçi' },
    { id: 'nectarine', en: 'Nectarine', tr: 'Nektarin' },
    { id: 'olive', en: 'Olive', tr: 'Zeytin' },
    { id: 'pomegranate', en: 'Pomegranate', tr: 'Nar' },
    { id: 'apricot', en: 'Apricot', tr: 'Kayısı' },
    { id: 'avocado', en: 'Avocado', tr: 'Avokado' },
    { id: 'blackcurrant', en: 'Blackcurrant', tr: 'Kara Frenk Üzümü' },
    { id: 'cantaloupe', en: 'Cantaloupe', tr: 'Kavun' },
    { id: 'grapefruit', en: 'Grapefruit', tr: 'Greyfurt' }
  ];
  


const App = () => {
  // fruits state'i, ekranda gösterilen meyveleri tutar
  // Başlangıçta 12 rastgele meyve seçmek için bir döngü kullanın
  const getRandomFruits = () => {
    const randomFruits = [];
    for (let i = 0; i < 12; i++) {
      const randomFruit = allFruits[Math.floor(Math.random() * allFruits.length)];
      randomFruits.push({ ...randomFruit, id: randomFruit.id + Date.now() + i }); // Benzersiz bir id ekleyin
    }
    return randomFruits;
  };

  const [fruits, setFruits] = useState(getRandomFruits());

  // Bir kart flip edildiğinde çağrılan fonksiyon
  
  const handleCardFlipEnd = (id:string) => {
    setFruits(currentFruits => {
      // Flip edilen kartın indeksini bul
      const index = currentFruits.findIndex(fruit => fruit.id === id);

      // Yeni meyve ekleyin
      const newFruit = allFruits[Math.floor(Math.random() * allFruits.length)];
      const newFruitWithUniqueID = { ...newFruit, id: newFruit.id + Date.now() };

      // Yeni meyveyi eski meyvenin yerine ekleyin
      const newFruits = [...currentFruits];
      newFruits.splice(index, 1, newFruitWithUniqueID);

      return newFruits;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst bölüm: Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerText}> New KELİME OYUNU</Text>
      </View>

      {/* Orta bölüm: Kartlar */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {fruits.map((fruit, index) => (
          <FlipCardComponent
            id={fruit.id}
            key={fruit.id}
            frontText={fruit.en}
            backText={fruit.tr}
            onFlipEnd={() => handleCardFlipEnd(fruit.id)}
          />
        ))}
      </ScrollView>

      {/* Alt bölüm: Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>By Oğuzhan Koca</Text>
      </View>
    </SafeAreaView>
  );
};

// Stil tanımlamaları
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  footerText: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;










// import React, { useState } from 'react';
// import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
// import FlipCardComponent from './FlipCardComponent';

// const allFruits = [
//   { id: 'apple', en: 'Apple', tr: 'Elma' },
//   { id: 'banana', en: 'Banana', tr: 'Muz' },
//   { id: 'orange', en: 'Orange', tr: 'Portakal' },
//   { id: 'strawberry', en: 'Strawberry', tr: 'Çilek' },
//   { id: 'grape', en: 'Grape', tr: 'Üzüm' },
//   { id: 'cherry', en: 'Cherry', tr: 'Kiraz' },
//   { id: 'watermelon', en: 'Watermelon', tr: 'Karpuz' },
//   { id: 'peach', en: 'Peach', tr: 'Şeftali' },
//   { id: 'pear', en: 'Pear', tr: 'Armut' },
//   { id: 'pineapple', en: 'Pineapple', tr: 'Ananas' },
//   { id: 'mango', en: 'Mango', tr: 'Mango' },
//   { id: 'blueberry', en: 'Blueberry', tr: 'Yaban Mersini' },
//   { id: 'kiwi', en: 'Kiwi', tr: 'Kivi' },
//   { id: 'lemon', en: 'Lemon', tr: 'Limon' },
//   { id: 'lime', en: 'Lime', tr: 'Lime' },
//   { id: 'papaya', en: 'Papaya', tr: 'Papaya' },
//   { id: 'raspberry', en: 'Raspberry', tr: 'Ahududu' },
//   { id: 'blackberry', en: 'Blackberry', tr: 'Böğürtlen' },
//   { id: 'coconut', en: 'Coconut', tr: 'Hindistan Cevizi' },
//   { id: 'fig', en: 'Fig', tr: 'İncir' },
//   { id: 'guava', en: 'Guava', tr: 'Guava' },
//   { id: 'lychee', en: 'Lychee', tr: 'Liçi' },
//   { id: 'nectarine', en: 'Nectarine', tr: 'Nektarin' },
//   { id: 'olive', en: 'Olive', tr: 'Zeytin' },
//   { id: 'pomegranate', en: 'Pomegranate', tr: 'Nar' },
//   { id: 'apricot', en: 'Apricot', tr: 'Kayısı' },
//   { id: 'avocado', en: 'Avocado', tr: 'Avokado' },
//   { id: 'blackcurrant', en: 'Blackcurrant', tr: 'Kara Frenk Üzümü' },
//   { id: 'cantaloupe', en: 'Cantaloupe', tr: 'Kavun' },
//   { id: 'grapefruit', en: 'Grapefruit', tr: 'Greyfurt' }
// ];

// const App = () => {
//   const [fruits, setFruits] = useState([
//     { en: 'Apple', tr: 'Elma' },
//     { en: 'Banana', tr: 'Muz' },
//     { en: 'Orange', tr: 'Portakal' },
//     { en: 'Apple', tr: 'Elma' },
//     { en: 'Banana', tr: 'Muz' },
//     { en: 'Orange', tr: 'Portakal' },
//     { en: 'Apple', tr: 'Elma' },
//     { en: 'Banana', tr: 'Muz' },
//     { en: 'Orange', tr: 'Portakal' },
//     { en: 'Apple', tr: 'Elma' },
//     { en: 'Banana', tr: 'Muz' },
//     { en: 'Orange', tr: 'Portakal' },
    
//   ]);

//   const handleCardFlipEnd = (id) => {
//     setFruits(currentFruits => currentFruits.filter(fruit => fruit.id !== id));
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>KELİME OYUNU</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.cardContainer}>
//       {fruits.map((fruit) => (
//         <FlipCardComponent
//           key={fruit.id}
//           frontText={fruit.en}
//           backText={fruit.tr}
//           onFlipEnd={() => handleCardFlipEnd(fruit.id)}
//         />
//       ))}
//     </ScrollView>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>By Oğuzhan Koca</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//      flex: 2,
    
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   cardContainer: {
    
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   footer: {
//      flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//   },
//   footerText: {
//     fontSize: 18,
//     color: '#333',
//   },
// });

// export default App;
