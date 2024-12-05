import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function ReviewScreen({ route, navigation }) {
  const { facility } = route.params || {};

  if (!facility) {
    return (
      <View style={styles.container}>
        <Text>시설물 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const { title, description, imageUrl, facilities } = facility;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    console.log('ReviewScreen facility object:', facility);
  }, [facility]);
  

  // Firestore에서 리뷰 가져오기 함수
  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('date', 'desc')); // 'date' 필드 기준으로 내림차순 정렬
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((review) => review.facilityTitle === title);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Firestore에서 리뷰를 가져오는 중 오류 발생:', error);
    }
  };

  // 화면이 포커스될 때마다 Firestore에서 리뷰를 다시 가져오기
  useFocusEffect(
    React.useCallback(() => {
      fetchReviews();
    }, [title])
  );

  const renderImage = () => {
    if (imageUrl) {
      console.log('Displaying facility image from URL:', imageUrl);
      return (
        <Image
          source={{ uri: imageUrl }}
          style={styles.facilityImage}
          onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
        />
      );
    }
  
    // 기본 이미지 사용
    return (
      <Image
        source={require('../assets/logo.png')}
        style={styles.facilityImage}
        onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
      />
    );
  };
  
  

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewUser}>{item.user}</Text>
      <Text style={styles.reviewDate}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
      <Text style={styles.reviewRating}>{'⭐'.repeat(item.rating)}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderImage()}
      <View style={styles.facilityInfo}>
        <Text style={styles.facilityName}>{title}</Text>
        <Text style={styles.facilityDescription}>{description}</Text>
      </View>
      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={() => navigation.navigate('WriteReviewScreen', { facility })}
      >
        <Text style={styles.writeReviewText}>리뷰 작성</Text>
      </TouchableOpacity>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.reviewList}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  facilityImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  facilityInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  facilityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  facilityDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  writeReviewButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    alignItems: 'center',
  },
  writeReviewText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewList: {
    paddingHorizontal: 16,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
  },
});