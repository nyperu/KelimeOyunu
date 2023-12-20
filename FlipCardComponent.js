import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import FlipCard from 'react-native-flip-card';

const FlipCardComponent = ({id, frontText, backText, onFlipEnd }) => {
  const [flipped, setFlipped] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
  
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  // useState kullanarak rastgele renkleri saklayın
  const [cardFrontColor, setCardFrontColor] = useState(getRandomColor());
  const [cardBackColor, setCardBackColor] = useState(getRandomColor());
  const handlePress = () => {
    setFlipped(!flipped);
    // Kartın yok olmadan önce 5 saniye beklemesi için setTimeout kullanın
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(onFlipEnd);
    }, 3000); // 5 saniye = 5000 milisaniye
  };
  

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
        <FlipCard
          flipHorizontal
          flipVertical={false}
          clickable={false}
          flip={flipped}
          style={styles.flipCard}
        >
          {/* Kartın Ön Yüzü */}
          <View style={[styles.face, { backgroundColor: cardFrontColor }]}>
            <Text style={styles.text}>{frontText}</Text>
          </View>
          {/* Kartın Arka Yüzü */}
          <View style={[styles.back, { backgroundColor: cardBackColor }]}>
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
