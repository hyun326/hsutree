import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as Location from 'expo-location';

export default function MapScreen({ navigation, route }) {
  const initialRegion = {
    latitude: 37.582300,
    longitude: 127.010180,
    latitudeDelta: 0.0041,
    longitudeDelta: 0.0040,
  };

  const [locations, setLocations] = useState([]);
  const [region, setRegion] = useState(initialRegion);
  const [search, setSearch] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null); // 위치 추적 구독 저장

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('오류', '위치 접근 권한이 거부되었습니다.');
        return;
      }

      startLocationTracking();
    };

    requestLocationPermission();
    fetchLocations();

    return () => {
      // 컴포넌트 언마운트 시 위치 추적 중지
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const startLocationTracking = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5초마다 위치 업데이트
          distanceInterval: 10, // 사용자가 10미터 이상 이동할 때마다 업데이트
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setRegion((prevRegion) => ({
            ...prevRegion,
            latitude,
            longitude,
          }));
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error('위치 추적 시작에 실패했습니다:', error);
    }
  };

  // Firestore에서 데이터 검색
  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'locations'));
      const fetchedLocations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocations(fetchedLocations);
    } catch (error) {
      console.error('Firestore에서 데이터를 검색하는 데 오류 발생:', error);
    }
  };

  // 특정 강의실의 위치를 찾아 지도 중심으로 설정
  const focusMapOnRoom = (room) => {
    if (!room) return;

    const matchingLocation = locations.find((location) =>
      location.facilities.some((facility) =>
        facility.name.toLowerCase().includes(room.toLowerCase().trim())
      ) ||
      location.title.toLowerCase().includes(room.toLowerCase().trim())
    );

    if (matchingLocation) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: matchingLocation.latitude,
        longitude: matchingLocation.longitude,
        latitudeDelta: prevRegion.latitudeDelta,
        longitudeDelta: prevRegion.longitudeDelta,
      }));
      setSelectedMarker(matchingLocation);
    } else {
      Alert.alert('오류', `해당 강의실(${room})의 위치를 찾을 수 없습니다.`);
    }
  };

  useEffect(() => {
    if (route?.params?.room) {
      focusMapOnRoom(route.params.room);
    }
  }, [route.params, locations]);

  // 검색 기능
  const handleSearch = (searchTerm) => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    let selectedFacility = null;
    let locationMatch = null;

    for (const location of locations) {
      selectedFacility = location.facilities.find((facility) =>
        facility.name.toLowerCase().includes(trimmedSearch)
      );
      if (selectedFacility) {
        locationMatch = location;
        break;
      }
    }

    if (selectedFacility) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: locationMatch.latitude,
        longitude: locationMatch.longitude,
        latitudeDelta: prevRegion.latitudeDelta,
        longitudeDelta: prevRegion.longitudeDelta,
      }));

      setSelectedMarker({
        title: selectedFacility.name,
        description: `시설물이 위치한 장소: ${locationMatch.title}`,
        imageUrl: selectedFacility.imageUrl || locationMatch.imageUrl,
        facilities: [selectedFacility],
      });
    } else if ((locationMatch = locations.find(
      (loc) =>
        loc.title.toLowerCase().includes(trimmedSearch) ||
        loc.description.toLowerCase().includes(trimmedSearch)
    ))) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: locationMatch.latitude,
        longitude: locationMatch.longitude,
        latitudeDelta: prevRegion.latitudeDelta,
        longitudeDelta: prevRegion.longitudeDelta,
      }));
      setSelectedMarker(locationMatch);
    } else {
      alert('검색 결과가 없습니다.');
    }

    if (trimmedSearch) {
      setRecentSearches((prev) =>
        [...new Set([trimmedSearch, ...prev])].slice(0, 5)
      );
    }
  };

  // 최근 검색어 클릭 시 텍스트만 설정
  const handleRecentSearch = (item) => {
    setSearch(item);
  };

  const clearSelection = () => {
    if (selectedMarker) {
      setSelectedMarker(null);
    }
    setShowRecentSearches(false);
  };

  const handleReviewNavigation = (location, facilityName) => {
    let facility = location.facilities.find((fac) => fac.name === facilityName);

    if (facility) {
      facility = {
        ...facility,
        title: facilityName,
        description: location.description,
        imageUrl: facility.imageUrl || location.imageUrl,
      };
    } else {
      facility = {
        title: location.title,
        description: location.description,
        facilities: location.facilities,
        imageUrl: location.imageUrl,
      };
    }

    navigation.navigate('ReviewScreen', { facility });
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowRecentSearches(false)}>
      <View style={{ flex: 1 }}>
        {/* 검색 창 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="장소, 설명 또는 시설물 검색..."
            value={search}
            onChangeText={setSearch}
            onFocus={() => setShowRecentSearches(true)}
            onSubmitEditing={() => handleSearch(search)}
          />
          {showRecentSearches && recentSearches.length > 0 && (
            <View style={styles.recentSearchContainer}>
              <Text style={styles.recentTitle}>최근 검색어</Text>
              {recentSearches.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleRecentSearch(item)}>
                  <Text style={styles.recentItem}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* 지도 */}
        <MapView
          style={{ flex: 1 }}
          provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          region={region}
          onMapReady={() => setMapReady(true)}
          onPress={() => {
            if (selectedMarker) {
              setSelectedMarker(null);
            }
            setShowRecentSearches(false);
          }}
        >
          {/* 사용자 위치 커스텀 마커 */}
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            onPress={() => setSelectedMarker({ title: '현재 위치', description: '이곳이 현재 위치입니다.' })}
          >
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
                현재 위치
              </Text>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: 'green',
                  borderRadius: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 1,
                    height: 1,
                    backgroundColor: 'white',
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
          </Marker>

          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onPress={() => {
                setSelectedMarker(location);
                setShowRecentSearches(false);
              }}
            >
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
                    backgroundColor: selectedMarker?.id === location.id ? 'blue' : 'red',
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
                시설물: {selectedMarker.facilities.map((fac) => fac.name).join(', ')}
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleReviewNavigation(selectedMarker, selectedMarker.title)}
              >
                <Text style={styles.buttonText}>리뷰</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 70,
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
