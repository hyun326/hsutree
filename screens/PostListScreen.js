import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native'; // useIsFocused import 추가
import { db } from '../firebaseConfig';

export default function PostListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const isFocused = useIsFocused(); // 현재 화면이 focus 되었는지 확인하는 훅

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
    });
  }, [navigation]);

  useEffect(() => {
    // Firestore에서 게시글 목록 가져오기
    if (isFocused) { // 화면이 focus 될 때마다 데이터를 다시 가져옴
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      });

      return () => unsubscribe();
    }
  }, [isFocused]); // isFocused가 변경될 때마다 effect 실행

  return (
    <View style={styles.container}>
      <Text style={styles.title}>게시판</Text>

      {/* 게시글 목록 */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postItem}
            onPress={() => navigation.navigate('PostDetailScreen', { post: item })}
          >
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postAuthor}>{item.author} - {new Date(item.timestamp?.toDate()).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 새 게시글 작성 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPostScreen')}
      >
        <Text style={styles.addButtonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },
  postItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postAuthor: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'deepskyblue',
    borderRadius: 30,
    padding: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
