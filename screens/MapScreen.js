import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore'; // Firestore 읽기 관련 함수
import { db } from '../firebaseConfig';

export default function MapScreen({ navigation }) {
  const [locations, setLocations] = useState([]); // Firestore에서 가져온 데이터를 저장
  const [region, setRegion] = useState({
    latitude: 37.582131, // 초기 지도 중심
    longitude: 127.010305,
    latitudeDelta: 0.0041,
    longitudeDelta: 0.0040,
  });

  const [search, setSearch] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 정보 저장
  const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어 저장
  const [showRecentSearches, setShowRecentSearches] = useState(false); // 최근 검색어 창 표시 여부

  // Firestore에서 데이터 가져오기
  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'locations')); // 'locations'는 Firestore 컬렉션 이름
      const fetchedLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore 문서 ID
        ...doc.data(), // 문서 데이터
      }));
      setLocations(fetchedLocations); // 상태 업데이트
    } catch (error) {
      console.error('Firestore에서 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchLocations(); // 컴포넌트가 처음 렌더링될 때 실행
  }, []);

// 검색 기능
const handleSearch = () => {
  const trimmedSearch = search.trim(); // 공백 제거

  // 시설물 검색
  const facilitiesMatch = locations.filter((loc) =>
    loc.facilities.some((facility) =>
      facility.toLowerCase().includes(trimmedSearch.toLowerCase())
    )
  );

  // 장소 검색
  const locationMatch = locations.find(
    (loc) =>
      loc.title.includes(trimmedSearch) ||
      loc.description.includes(trimmedSearch)
  );

  if (facilitiesMatch.length > 0) {
    // 시설물 검색 결과
    const combinedDescription = facilitiesMatch
      .map((loc) => loc.title)
      .join(', ');

    setRegion({
      ...region,
      latitude: facilitiesMatch[0].latitude,
      longitude: facilitiesMatch[0].longitude,
    });
    setSelectedMarker({
      title: `시설물: ${trimmedSearch}`,
      description: `시설물이 위치한 장소: ${combinedDescription}`,
      facilities: facilitiesMatch.map((loc) => loc.facilities).flat(),
    });
  } else if (locationMatch) {
    // 장소 검색 결과
    setRegion({
      ...region,
      latitude: locationMatch.latitude,
      longitude: locationMatch.longitude,
    });
    setSelectedMarker(locationMatch);
  } else {
    alert('검색 결과가 없습니다.');
  }

  if (trimmedSearch) {
    setRecentSearches((prev) =>
      [...new Set([trimmedSearch, ...prev])].slice(0, 5)
    );
  }
  setShowRecentSearches(false); // 검색 후 최근 검색어 창 닫기
};


  const clearSelection = () => {
    setSelectedMarker(null);
    setShowRecentSearches(false); // 맵을 누르면 최근 검색어 창 닫기
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 검색 창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="장소, 설명 또는 시설물 검색..."
          value={search}
          onChangeText={setSearch}
          onFocus={() => setShowRecentSearches(true)} // 검색창 클릭 시 최근 검색어 표시
          onSubmitEditing={handleSearch} // 검색 버튼 누를 시 실행
        />
      </View>

      {/* 지도 */}
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        onPress={clearSelection} // 맵을 누르면 선택 해제
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => setSelectedMarker(location)} // 클릭된 마커 설정
          >
            {/* 마커 커스텀 뷰 */}
            <View style={{ alignItems: 'center', overflow: 'visible' }}>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center',
                  flexWrap: 'wrap',
                }}
                numberOfLines={0}
              >
                {location.title}
              </Text>
              <View
                style={{
                  width: selectedMarker?.id === location.id ? 20 : 20,
                  height: selectedMarker?.id === location.id ? 20 : 20,
                  backgroundColor:
                    selectedMarker?.id === location.id ? 'blue' : 'red',
                  borderRadius: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: selectedMarker?.id === location.id ? 5 : 5,
                    height: selectedMarker?.id === location.id ? 5 : 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 하단 창 */}
      {selectedMarker && (
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>{selectedMarker.title}</Text>
          <Text style={styles.description}>{selectedMarker.description}</Text>
          {selectedMarker.facilities && selectedMarker.facilities.length > 0 && (
            <Text style={styles.facilities}>
              시설물: {selectedMarker.facilities.join(', ')}
            </Text>
          )}
          {/* 리뷰 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log('Navigating with facility:', selectedMarker);
                navigation.navigate('ReviewScreen', { facility: selectedMarker });
              }}
            >
              <Text style={styles.buttonText}>리뷰</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 최근 검색어 */}
      {showRecentSearches && (
        <View style={styles.recentSearchContainer}>
          <Text style={styles.recentTitle}>최근 검색어</Text>
          {recentSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSearch(item);
                handleSearch();
                setShowRecentSearches(false); // 최근 검색어 클릭 시 창 닫기
              }}
            >
              <Text style={styles.recentItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  facilities: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recentSearchContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recentItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});
