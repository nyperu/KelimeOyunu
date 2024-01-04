import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import FlipCard from 'react-native-flip-card';

const FlipCardComponent = ({ id, frontText, backText, onFlipEnd }) => {
  const [flipped, setFlipped] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // Doğru veya yanlış bilindiğini tutan state
  const fadeAnim = new Animated.Value(1);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handlePress = async () => {
    setFlipped(!flipped);
    // onFlipEnd fonksiyonunu çağır ve dönen değeri kullanarak kartın durumunu kontrol et
    const result = await onFlipEnd(id);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    setIsCorrect(result);

    if (result) {
      // Doğru bilindiyse, kartın yavaşça kaybolmasını sağla
      setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 5000,
        useNativeDriver: true,
      }).start().start(() => {
        // Animasyon tamamlandıktan sonra flip durumunu false yap
        setFlipped(false);
      });
    }, 1000); // 1 saniye sonra kaybolma animasyonunu başlat
    } else {
      // Yanlış bilindiyse, kartın flip olmasını ve eski haline dönmesini sağla
      setTimeout(() => {
        setFlipped(false);
      }, 3000); // 3 saniye sonra kartı eski haline döndür
    }
  };

  return (
    <Animated.View style={[styles.card, { opacity: isCorrect ? fadeAnim : 1 }]}>
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <FlipCard
          flipHorizontal
          flipVertical={false}
          clickable={false}
          flip={flipped}
          style={styles.flipCard}
        >
          {/* Kartın Ön Yüzü */}
          <View style={[styles.face, { backgroundColor: getRandomColor() }]}>
            <Text style={styles.text}>{frontText}</Text>
          </View>
          {/* Kartın Arka Yüzü */}
          <View style={[styles.back, { backgroundColor: getRandomColor() }]}>
            <Text style={styles.text}>{backText}</Text>
          </View>
        </FlipCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 100,
    margin: 10,
  },
  touchable: {
    flex: 1,
  },
  flipCard: {
    flex: 1,
  },
  face: {
    flex: 1,
    backgroundColor: '#FE474C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
  },
  back: {
    flex: 1,
    backgroundColor: '#FEB12C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default FlipCardComponent;
