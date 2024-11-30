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
  ];

  // 검색 기능: title, description, 또는 facilities 기준으로 검색
  const handleSearch = () => {
    const location = locations.find(
      (loc) =>
        loc.title.includes(search.trim()) ||
        loc.description.includes(search.trim()) ||
        loc.facilities.some((facility) =>
          facility.toLowerCase().includes(search.trim().toLowerCase())
        )
    );

    if (location) {
      setRegion({
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setSelectedMarker(location); // 검색된 마커 선택
    } else {
      alert('검색 결과가 없습니다.');
    }
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
          onSubmitEditing={handleSearch} // 검색 버튼 누를 시 실행
        />
      </View>

      {/* 지도 */}
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
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
          <Text style={styles.facilities}>
  시설물: {selectedMarker?.facilities ? selectedMarker.facilities.join(', ') : '정보 없음'}
</Text>


          {/* 버튼 추가 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>리뷰</Text>
            </TouchableOpacity>
          </View>
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
    zIndex: 1, // 맵 위에 표시되도록 설정
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
    marginBottom: 70,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 50,
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
});
