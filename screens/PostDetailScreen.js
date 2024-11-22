import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
    });
  }, [navigation]);

  useEffect(() => {
    // Firestore에서 댓글 목록 가져오기
    const q = query(collection(db, 'posts', post.id, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleAddComment = useCallback(async () => {
    const comment = commentInputRef.current;
    if (!comment) {
      Alert.alert('오류', '댓글을 입력하세요.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts', post.id, 'comments'), {
        text: comment,
        timestamp: serverTimestamp(),
      });
      commentInputRef.current = ''; // 입력 필드 초기화
    } catch (error) {
      Alert.alert('오류', '댓글 작성 중 문제가 발생했습니다.');
    }
  }, [post.id]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.timestamp}>{new Date(post.timestamp?.toDate()).toLocaleString()}</Text>
        </View>
        <View style={styles.separator} />
        <Text style={styles.content}>{post.content}</Text>
      </View>

      <View style={styles.commentContainer}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text>{item.text}</Text>
              <Text style={styles.commentTimestamp}>{new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="댓글을 입력하세요"
                onChangeText={(text) => (commentInputRef.current = text)}
                defaultValue={commentInputRef.current}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
                <Text style={styles.addButtonText}>작성</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  postContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#555',
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  commentContainer: {
    flex: 1,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  commentItem: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: 'deepskyblue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
  },
});