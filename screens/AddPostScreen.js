import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AddPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('익명'); // 작성자 기본값

  const handleAddPost = async () => {
    if (!title || !content) {
      Alert.alert('오류', '제목과 내용을 입력하세요.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        author,
        timestamp: serverTimestamp(),
      });
      Alert.alert('완료', '게시글이 작성되었습니다.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '게시글 작성 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>내용</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="내용을 입력하세요"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Text style={styles.label}>작성자</Text>
      <TextInput
        style={styles.input}
        placeholder="작성자를 입력하세요 (기본값: 익명)"
        value={author}
        onChangeText={setAuthor}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
        <Text style={styles.addButtonText}>게시글 작성</Text>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: 'deepskyblue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
