import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Alert, TouchableWithoutFeedback, PermissionsAndroid ,StyleSheet} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Geolocation from 'react-native-geolocation-service';

export default function MapScreen({ navigation, route }) {
  const [locations, setLocations] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.582300,
    longitude: 127.010180,
    latitudeDelta: 0.0041,
    longitudeDelta: 0.0040,
  });
  const [search, setSearch] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: '위치 접근 권한 요청',
              message: '현재 위치를 사용하려면 위치 접근 권한이 필요합니다.',
              buttonNeutral: '나중에 묻기',
              buttonNegative: '취소',
              buttonPositive: '허용',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            console.log('위치 접근 권한이 거부되었습니다.');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
    fetchLocations();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion((prevRegion) => ({
          ...prevRegion,
          latitude,
          longitude,
        }));
      },
      (error) => {
        console.error('현재 위치를 가져오는 데 실패했습니다:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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
        facility.toLowerCase().includes(room.toLowerCase().trim())
      ) ||
      location.title.toLowerCase().includes(room.toLowerCase().trim())
    );

    if (matchingLocation) {
      setRegion({
        latitude: matchingLocation.latitude,
        longitude: matchingLocation.longitude,
        latitudeDelta: 0.0041,
        longitudeDelta: 0.0040,
      });
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
  const handleSearch = () => {
    const trimmedSearch = search.trim();

    const facilitiesMatch = locations.filter((loc) =>
      loc.facilities.some((facility) =>
        facility.toLowerCase().includes(trimmedSearch.toLowerCase())
      )
    );

    const locationMatch = locations.find(
      (loc) =>
        loc.title.includes(trimmedSearch) ||
        loc.description.includes(trimmedSearch)
    );

    if (facilitiesMatch.length > 0) {
      const combinedDescription = facilitiesMatch.map((loc) => loc.title).join(', ');

      setRegion({
        ...region,
        latitude: facilitiesMatch[0].latitude,
        longitude: facilitiesMatch[0].longitude,
      });
      setSelectedMarker({
        title: `${trimmedSearch}`,
        description: `시설물이 위치한 장소: ${combinedDescription}`,
        facilities: facilitiesMatch.map((loc) => loc.facilities).flat(),
      });
    } else if (locationMatch) {
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
    setShowRecentSearches(true);
  };

  const clearSelection = () => {
    setSelectedMarker(null);
    setShowRecentSearches(false);
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
            onSubmitEditing={handleSearch}
          />
          {showRecentSearches && recentSearches.length > 0 && (
            <View style={styles.recentSearchContainer}>
              <Text style={styles.recentTitle}>최근 검색어</Text>
              {recentSearches.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => {
                  setSearch(item);
                  handleSearch();
                }}>
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
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          onPress={clearSelection}
        >
          {/* 사용자 위치 마커 추가 */}
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
              onPress={() => setSelectedMarker(location)}
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
                시설물: {selectedMarker.facilities.join(', ')}
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('ReviewScreen', {
                    facility: {
                      title: selectedMarker.title,
                      description: selectedMarker.description,
                      facilities: selectedMarker.facilities,
                    },
                  });
                }}
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
