import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Dialog from 'react-native-dialog';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef('');
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false); // 비밀번호 다이얼로그 상태
  const [isDeleteConfirmDialogVisible, setIsDeleteConfirmDialogVisible] = useState(false); // 삭제 확인 다이얼로그 상태
  const [isEditConfirmDialogVisible, setIsEditConfirmDialogVisible] = useState(false); // 수정 확인 다이얼로그 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
      headerRight: () => (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteOrEditPostPress}>
          <Text style={styles.deleteButtonText}>수정/삭제</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, post.id]);

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

  const handlePasswordCheck = async (action) => {
    try {
      const postRef = doc(db, 'posts', post.id);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists() && postSnapshot.data().password === password) {
        setIsPasswordDialogVisible(false); // 비밀번호 다이얼로그 닫기
        if (action === 'delete') {
          setIsDeleteConfirmDialogVisible(true); // 삭제 확인 다이얼로그 띄우기
        } else if (action === 'edit') {
          setIsEditConfirmDialogVisible(true); // 수정 확인 다이얼로그 띄우기
        }
      } else {
        Alert.alert('오류', '잘못된 비밀번호입니다.');
      }
    } catch (error) {
      Alert.alert('오류', '비밀번호 확인 중 문제가 발생했습니다.');
    }
  };

  const handleDeleteOrEditPostPress = () => {
    // 비밀번호 입력을 요구하는 다이얼로그를 띄운다
    setIsPasswordDialogVisible(true);
  };

  const handleDeletePost = async () => {
    try {
      const postRef = doc(db, 'posts', post.id);
      await deleteDoc(postRef);
      Alert.alert('성공', '게시글이 삭제되었습니다.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '게시글 삭제 중 문제가 발생했습니다.');
    }
  };

  const handleEditPost = () => {
    setIsEditConfirmDialogVisible(false);
    navigation.navigate('AddPostScreen', { post, isEditing: true });
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmDialogVisible(false); // 삭제 확인 다이얼로그 닫기
  };

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

      {/* 비밀번호 입력 다이얼로그 */}
      <Dialog.Container visible={isPasswordDialogVisible}>
        <Dialog.Title>비밀번호 입력</Dialog.Title>
        <Dialog.Input
          placeholder="4자리 숫자"
          secureTextEntry
          keyboardType="numeric"
          maxLength={4}
          value={password}
          onChangeText={setPassword}
        />
        <Dialog.Button label="취소" onPress={() => setIsPasswordDialogVisible(false)} />
        <Dialog.Button label="수정" onPress={() => handlePasswordCheck('edit')} />
        <Dialog.Button label="삭제" onPress={() => handlePasswordCheck('delete')} />
      </Dialog.Container>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog.Container visible={isDeleteConfirmDialogVisible}>
        <Dialog.Title>게시글 삭제 확인</Dialog.Title>
        <Dialog.Description>게시글을 삭제하시겠습니까?</Dialog.Description>
        <Dialog.Button label="취소" onPress={handleDeleteCancel} />
        <Dialog.Button label="확인" onPress={handleDeletePost} />
      </Dialog.Container>

      {/* 수정 확인 다이얼로그 */}
      <Dialog.Container visible={isEditConfirmDialogVisible}>
        <Dialog.Title>게시글 수정 확인</Dialog.Title>
        <Dialog.Description>게시글을 수정하시겠습니까?</Dialog.Description>
        <Dialog.Button label="취소" onPress={() => setIsEditConfirmDialogVisible(false)} />
        <Dialog.Button label="확인" onPress={handleEditPost} />
      </Dialog.Container>
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
  deleteButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
