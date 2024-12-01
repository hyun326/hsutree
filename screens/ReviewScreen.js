import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

export default function ReviewScreen({ route, navigation }) {
  const { facility } = route.params || {}; // route.params가 없을 경우 처리

  if (!facility) {
    return (
      <View style={styles.container}>
        <Text>시설물 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  console.log('Facility:', facility);

  const reviews = [
    // 임시 리뷰 데이터
    {
      id: 1,
      user: '유관호',
      date: '2024년 10월 25일',
      rating: 5,
      comment: '커피가 맛있어요~\n특히 트리플라떼가 맛있습니다',
    },
    {
      id: 2,
      user: '이은호',
      date: '2024년 10월 24일',
      rating: 3,
      comment: '아이스아메리카노\n아아는 그냥 그렇네요...',
    },
  ];

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewUser}>{item.user}</Text>
      <Text style={styles.reviewDate}>{item.date}</Text>
      <Text style={styles.reviewRating}>{'⭐'.repeat(item.rating)}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
<Image
  source={
    facility.image
      ? { uri: facility.image } // 이미지가 존재할 경우 사용
      : require('../assets/logo.png') // 기본 이미지 사용 (placeholder.png는 프로젝트에 추가해야 함)
  }
  style={styles.facilityImage}
/>

      <View style={styles.facilityInfo}>
        <Text style={styles.facilityName}>{facility.name}</Text>
        <Text style={styles.facilityLocation}>{facility.location}</Text>
      </View>
      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={() => navigation.navigate('WriteReviewScreen', { facility })}
      >
        <Text style={styles.writeReviewText}>리뷰 작성</Text>
      </TouchableOpacity>
      <Text style={styles.recentReviewTitle}>최근 리뷰</Text>
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
    justifyContent: 'center', // 에러 텍스트를 화면 중앙에 배치
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    margin: 20,
  },
  facilityImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0', // 기본 배경색 설정
  },
  
  emptyImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0', // 빈칸 배경색
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
  facilityLocation: {
    fontSize: 16,
    color: '#555',
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
  recentReviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
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
