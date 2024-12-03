import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export default function WriteReviewScreen({ route, navigation }) {
  const { facility } = route.params || {};

  if (!facility) {
    return (
      <View style={styles.container}>
        <Text>시설물 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const { title } = facility;

  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  // Firestore에 새로운 리뷰 추가하기
  const addReview = async () => {
    if (newReview.trim() === '') {
      Alert.alert('오류', '리뷰 내용을 입력해주세요.');
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert('오류', '평점을 선택해주세요.');
      return;
    }

    const reviewData = {
      facilityTitle: title,
      user: '익명',
      comment: newReview,
      rating,
      date: Timestamp.now(), // Firestore Timestamp 객체로 저장
    };

    try {
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      console.log('리뷰가 Firestore에 추가되었습니다. ID:', docRef.id);
      setNewReview('');
      navigation.goBack(); // 리뷰 작성 후 ReviewScreen으로 돌아가기
    } catch (error) {
      console.error('리뷰를 Firestore에 추가하는 중 오류 발생:', error);
      Alert.alert('오류', '리뷰를 저장하는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{title}에 대한 리뷰 작성</Text>
      <TextInput
        style={styles.reviewInput}
        placeholder="리뷰를 작성해주세요..."
        value={newReview}
        onChangeText={setNewReview}
        multiline={true}
      />

      <Text style={styles.ratingPrompt}>평점을 선택해주세요:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.ratingButton, rating === value && styles.selectedRatingButton]}
            onPress={() => setRating(value)}
          >
            <Text style={[styles.ratingButtonText, rating === value && styles.selectedRatingButtonText]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addReviewButton} onPress={addReview}>
        <Text style={styles.addReviewButtonText}>리뷰 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ratingPrompt: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedRatingButton: {
    backgroundColor: '#007BFF',
  },
  ratingButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  selectedRatingButtonText: {
    color: '#fff',
  },
  addReviewButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
