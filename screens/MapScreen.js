import React, { useState, useEffect } from 'react';
import { View, Platform, Text, TextInput, StyleSheet } from 'react-native';
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
  const [selectedMarker, setSelectedMarker] = useState(null);

  const locations = [
    {
      id: 1,
      title: '창의관',
      description: '여기는 창의관입니다.',
      latitude: 37.582138,
      longitude: 127.010805,
    },
    {
      id: 2,
      title: '낙산관',
      description: '여기는 낙산관입니다.',
      latitude: 37.582100,
      longitude: 127.011305,
    },
    {
      id: 3,
      title: '미래관',
      description: '여기는 미래관입니다.',
      latitude: 37.582548, 
      longitude: 127.010805, 
    },
    {
      id: 4,
      title: '우촌관',
      description: '여기는 우촌관입니다.',
      latitude: 37.583038, 
      longitude: 127.010605, 
    },
    {
      id: 5,
      title: '상상관',
      description: '여기는 상상관입니다.',
      latitude: 37.582648, 
      longitude: 127.010105, 
    },
    {
      id: 6,
      title: '풋살장',
      description: '여기는 풋살입니다.',
      latitude: 37.582628, 
      longitude: 127.009405, 
    },
    {
      id: 7,
      title: '잔디광장',
      description: '여기는 잔디광장입니다.',
      latitude: 37.582628, //위도
      longitude: 127.009705, //경도
    },
    {
      id: 8,
      title: '진리관',
      description: '여기는 잔리관입니다.',
      latitude: 37.583028, //위도
      longitude: 127.009575, //경도
    },
    {
      id: 9,
      title: '탐구관',
      description: '여기는 탐구관입니다.',
      latitude: 37.583448, //위도
      longitude: 127.009135, //경도
    },
    {
      id: 10,
      title: '학군단',
      description: '여기는 학군단입니다.',
      latitude: 37.583178, //위도
      longitude: 127.008915, //경도
    },
    {
      id: 11,
      title: '연구관',
      description: '여기는 연구관입니다.',
      latitude: 37.582288, //위도
      longitude: 127.009785, //경도
    },
    {
      id: 12,
      title: '지선관',
      description: '여기는 지선관입니다.',
      latitude: 37.581998, //위도
      longitude: 127.009785, //경도
    },
    {
      id: 13,
      title: '공학관A',
      description: '여기는 공학관 A입니다.',
      latitude: 37.581798, //위도
      longitude: 127.009865, //경도
    },
    {
      id: 14,
      title: '공학관B',
      description: '여기는 공학관 B입니다.',
      latitude: 37.581498, //위도
      longitude: 127.009585, //경도
    },
    {
      id: 15,
      title: '상상빌리지',
      description: '여기는 상상빌리지입니다.',
      latitude: 37.581498, //위도
      longitude: 127.010005, //경도
    },
    {
      id: 16,
      title: '인성관',
      description: '여기는 인성관입니다.',
      latitude: 37.581938, 
      longitude: 127.010805,
    },
    {
      id: 17,
      title: '학송관',
      description: '여기는 학송관입니다.',
      latitude: 37.583298, //위도
      longitude: 127.009575, //경도
    },

  ];

  // 검색 기능: title과 description 기준으로 검색
  const handleSearch = () => {
    const location = locations.find(
      (loc) =>
        loc.title.includes(search.trim()) ||
        loc.description.includes(search.trim())
    );

    if (location) {
      setRegion({
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setSelectedMarker(location.id); // 검색된 마커 선택
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
          placeholder="장소나 설명 검색..."
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
            onPress={() => setSelectedMarker(location.id)} // 클릭된 마커 설정
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
                  width: selectedMarker === location.id ? 20 : 20,
                  height: selectedMarker === location.id ? 20 : 20,
                  backgroundColor:
                    selectedMarker === location.id ? 'blue' : 'red',
                  borderRadius: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: selectedMarker === location.id ? 5 : 5,
                    height: selectedMarker === location.id ? 5 : 5,
                    backgroundColor: 'white',
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
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
});
