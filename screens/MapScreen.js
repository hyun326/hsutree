import React, { useState, useEffect } from 'react';
import { View, Platform, Text } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen({ navigation }) {
  // 네비게이션 옵션 설정
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
    });
  }, [navigation]);

  // 초기 맵 중심 설정
  const [region, setRegion] = useState({
    latitude: 37.582137, // 상상관의 중심 위도
    longitude: 127.010805, // 상상관의 중심 경도
    latitudeDelta: 0.0041, // 지도 확대/축소 정도
    longitudeDelta: 0.0040,
  });

  // 선택된 마커 ID 상태 관리
  const [selectedMarker, setSelectedMarker] = useState(null);

  // 마커 위치 데이터
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


  return (
    <View style={{ flex: 1 }}>
<MapView
  style={{ flex: 1 }}
  provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
  region={region}
  padding={{ top: 50, right: 30, bottom: 50, left: 20 }} // 지도 패딩 추가
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
            <View
              style={{
                width: selectedMarker === location.id ? 40 : 30, // 클릭된 마커 크기
                height: selectedMarker === location.id ? 40 : 30,
                backgroundColor: selectedMarker === location.id ? 'blue' : 'red', // 클릭된 마커 색상
                borderRadius: 80, // 원 모양
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: selectedMarker === location.id ? 10 : 10,
                  height: selectedMarker === location.id ? 10 : 10,
                  backgroundColor: 'white',
                  borderRadius: 10,
                }}
              />
            </View>

            {/* Callout 컴포넌트로 설명 표시 */}
            <Callout>
              <View style={{ width: 150, padding: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{location.title}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>{location.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}