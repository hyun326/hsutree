import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WriteReviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>리뷰 작성 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
