import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function PostListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
    });
  }, [navigation]);



  useEffect(() => {
    // Firestore에서 게시글 목록 가져오기
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

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
