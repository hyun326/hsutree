import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useSignUp } from '../SignUpContext'; // Context에서 데이터 가져오기

export default function AddPostScreen({ route, navigation }) {
  const { post, isEditing } = route.params || {};
  const { signUpData } = useSignUp(); // 로그인 정보 가져오기

  const [title, setTitle] = useState(post ? post.title : ''); // 수정 모드일 경우 초기값 설정
  const [content, setContent] = useState(post ? post.content : ''); // 수정 모드일 경우 초기값 설정
  const [author, setAuthor] = useState(post ? post.author : signUpData.nickname || '익명'); // 로그인된 사용자 닉네임 기본값 설정
  const [password, setPassword] = useState(post ? post.password : ''); // 수정 모드일 경우 초기값 설정

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? '게시글 수정' : '게시글 작성', // 수정 모드에 따라 헤더 타이틀 변경
    });
  }, [navigation, isEditing]);

  const handleSavePost = async () => {
    if (!title || !content) {
      Alert.alert('오류', '제목과 내용을 입력하세요.');
      return;
    }

    if (password.length !== 4) {
      Alert.alert('오류', '비밀번호는 4자리 숫자여야 합니다.');
      return;
    }

    try {
      if (isEditing) {
        // 수정 모드인 경우 기존 게시글 업데이트
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
          title,
          content,
          author,
          password,
          timestamp: serverTimestamp(),
        });
        Alert.alert('완료', '게시글이 수정되었습니다.');
      } else {
        // 새 게시글 작성
        await addDoc(collection(db, 'posts'), {
          title,
          content,
          author,
          password,
          timestamp: serverTimestamp(),
        });
        Alert.alert('완료', '게시글이 작성되었습니다.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', isEditing ? '게시글 수정 중 문제가 발생했습니다.' : '게시글 작성 중 문제가 발생했습니다.');
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
        placeholder="작성자를 입력하세요 (기본값: 닉네임)"
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

      <TouchableOpacity style={styles.addButton} onPress={handleSavePost}>
        <Text style={styles.addButtonText}>{isEditing ? '게시글 수정' : '게시글 작성'}</Text>
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
