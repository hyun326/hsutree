import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AddPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('익명');
  const [password, setPassword] = useState(''); // 비밀번호 상태 추가

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
    });
  }, [navigation]);

  const handleAddPost = async () => {
    if (!title || !content) {
      Alert.alert('오류', '제목과 내용을 입력하세요.');
      return;
    }

    if (password.length !== 4) {
      Alert.alert('오류', '비밀번호는 4자리 숫자여야 합니다.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        author,
        password, // 비밀번호 저장
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

      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="4자리 숫자 비밀번호"
        value={password}
        onChangeText={setPassword}
        keyboardType="numeric"
        secureTextEntry={true}
        maxLength={4}
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
