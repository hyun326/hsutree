import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>{post.author} - {new Date(post.timestamp?.toDate()).toLocaleString()}</Text>
      <Text style={styles.content}>{post.content}</Text>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>목록으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: 'deepskyblue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
