import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // 제목을 빈 문자열로 설정
    });
  }, [navigation])
 
 
 
  const [region, setRegion] = useState({
    latitude: 37.582138,
    longitude: 127.010805,
    latitudeDelta: 0.000922,
    longitudeDelta: 0.00421,
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
        region={region}
      />
    </View>
  );
}