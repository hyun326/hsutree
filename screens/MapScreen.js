import React, { useState, useEffect } from 'react';
import { View, Platform, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
    });
  }, [navigation]);

  const [region, setRegion] = useState({
    latitude: 37.582131, // 상상관의 중심 위도
    longitude: 127.010305, // 상상관의 중심 경도
    latitudeDelta: 0.0041, // 지도 확대/축소 정도
    longitudeDelta: 0.0040,
  });

  const [search, setSearch] = useState(''); // 검색 창 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 정보 저장
  const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어 저장
  const [showRecentSearches, setShowRecentSearches] = useState(false); // 최근 검색어 창 표시 여부

  const locations = [
    {
      id: 1,
      title: '창의관',
      description: '여기는 창의관입니다.',
      facilities: ['Wi-Fi', 'Restrooms', 'Cafeteria'],
      latitude: 37.582138,
      longitude: 127.010805,
    },
    {
      id: 2,
      title: '낙산관',
      description: '여기는 낙산관입니다.',
      facilities: ['Library', 'Study Room'],
      latitude: 37.582100,
      longitude: 127.011305,
    },
    {
      id: 3,
      title: '미래관',
      description: '여기는 미래관입니다.',
      facilities: ['Lecture Halls', 'Wi-Fi'],
      latitude: 37.582548,
      longitude: 127.010805,
    },
    {
      id: 4,
      title: '우촌관',
      description: '여기는 우촌관입니다.',
      facilities: ['Sports Center', 'Locker Rooms'],
      latitude: 37.583038,
      longitude: 127.010605,
    },
    {
      id: 5,
      title: '상상관',
      description: '여기는 상상관입니다.',
      facilities: ['Auditorium', 'Parking'],
      latitude: 37.582648,
      longitude: 127.010105,
    },
    {
      id: 6,
      title: '풋살장',
      description: '여기는 풋살장입니다.',
      facilities: ['Sports Field', 'Benches'],
      latitude: 37.582628,
      longitude: 127.009405,
    },
    {
      id: 7,
      title: '잔디광장',
      description: '여기는 잔디광장입니다.',
      facilities: ['Picnic Area', 'Wi-Fi'],
      latitude: 37.582628,
      longitude: 127.009705,
    },
    {
      id: 8,
      title: '진리관',
      description: '여기는 진리관입니다.',
      facilities: ['Lecture Halls', 'Cafeteria'],
      latitude: 37.583028,
      longitude: 127.009575,
    },
    {
      id: 9,
      title: '탐구관',
      description: '여기는 탐구관입니다.',
      facilities: ['Research Labs', 'Library'],
      latitude: 37.583448,
      longitude: 127.009135,
    },
    {
      id: 10,
      title: '학군단',
      description: '여기는 학군단입니다.',
      facilities: ['Military Training Rooms', 'Locker Rooms'],
      latitude: 37.583178,
      longitude: 127.008915,
    },
    {
      id: 11,
      title: '연구관',
      description: '여기는 연구관입니다.',
      facilities: ['Laboratories', 'Conference Rooms'],
      latitude: 37.582288,
      longitude: 127.009785,
    },
    {
      id: 12,
      title: '지선관',
      description: '여기는 지선관입니다.',
      facilities: ['Classrooms', 'Computer Labs'],
      latitude: 37.581998,
      longitude: 127.009785,
    },
    {
      id: 13,
      title: '공학관A',
      description: '여기는 공학관 A입니다.',
      facilities: ['Engineering Labs', 'Wi-Fi'],
      latitude: 37.581798,
      longitude: 127.009865,
    },
    {
      id: 14,
      title: '공학관B',
      description: '여기는 공학관 B입니다.',
      facilities: ['Workshops', '3D Printing'],
      latitude: 37.581498,
      longitude: 127.009585,
    },
    {
      id: 15,
      title: '상빌',
      description: '여기는 상상빌리지입니다.',
      facilities: ['Dormitories', 'Cafeteria'],
      latitude: 37.581498,
      longitude: 127.010005,
    },
    {
      id: 16,
      title: '인성관',
      description: '여기는 인성관입니다.',
      facilities: ['Lecture Halls', 'Meeting Rooms'],
      latitude: 37.581938,
      longitude: 127.010805,
    },
    {
      id: 17,
      title: '학송관',
      description: '여기는 학송관입니다.',
      facilities: ['Music Rooms', 'Auditorium'],
      latitude: 37.583298,
      longitude: 127.009575,
    },
  ];
  

  // 검색 기능: 장소, 설명, 또는 시설물 기준으로 검색
  const handleSearch = () => {
    const trimmedSearch = search.trim(); // 공백 제거

    // 시설물 검색
    const facilityMatch = locations.find((loc) =>
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

    if (facilityMatch) {
      // 시설물 검색 결과
      setRegion({
        ...region,
        latitude: facilityMatch.latitude,
        longitude: facilityMatch.longitude,
      });
      setSelectedMarker({
        ...facilityMatch,
        title: `시설물: ${trimmedSearch}`,
        description: `시설물이 위치한 장소: ${facilityMatch.title}`,
      });
    } else if (locationMatch) {
      // 장소 검색 결과
      setRegion({
        ...region,
        latitude: locationMatch.latitude,
        longitude: locationMatch.longitude,
      });
      setSelectedMarker(locationMatch); // 검색된 마커 선택
    } else {
      alert('검색 결과가 없습니다.');
    }

    if (trimmedSearch) {
      // 최근 검색어 업데이트
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

          {/* 버튼 추가 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
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
    top: 60, // 검색창 바로 아래
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
