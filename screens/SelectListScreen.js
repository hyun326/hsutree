import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import DropDownPicker from 'react-native-dropdown-picker';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function FindPasswordScreen({ navigation }) { //회원가입창 2
  
  const NextNavigate = () => {
    navigation.navigate('SetPassWordScreen'); // 회원가입 다음 창으로 넘어가는 로직 구현해야함 (아직 구현안됨)
  }

  const CancelNavigate = () => {
    navigation.navigate('RegisterScreen'); // 회원가입 다음 창으로 넘어가는 로직 구현해야함 (아직 구현안됨)
  }
  
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const data = [
    { label: '컴퓨터공학부', value: '컴퓨터공학부' },
    { label: 'ICT디자인학부', value: 'ICT디자인학부' },
    { label: 'IT공과대학', value: 'IT공과대학' },
    { label: 'IT융합공학부', value: 'IT융합공학부' },
    { label: '기계전자공학부', value: '기계전자공학부' },
    { label: '스마트 경영공학부', value: '스마트 경영공학부' },
  ];

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 헤더 숨기기
  }, [navigation]);

  


  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>
      
      <Text style={styles.title}>한성대숲</Text>

      <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={selected}
          setValue={setSelected}
          items={data}
          placeholder="학과 이름을 선택하세요"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          zIndex={3000}
          zIndexInverse={1000}
          searchable={true} // 검색 기능 활성화
          searchPlaceholder="검색하세요..." // 검색 입력 필드의 플레이스홀더
          searchTextInputStyle={{
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
          }} // 검색 입력 필드 스타일
          ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>검색 결과가 없습니다</Text> 
          )}
        />
       
      </View>
        {/* 하단 버튼 영역 */}
      <View style={styles.buttonContainer}>
        {/* 취소 버튼 */}
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={CancelNavigate}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>

        {/* 다음 버튼 */}
        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={NextNavigate}>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
  },
  imageContainer: {
    marginBottom: 20, // 이미지와 텍스트 간격
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 30, // 텍스트와 입력 필드 간격
  },
  dropdownContainer: {
    width: '80%', // 부모 컨테이너의 너비 설정
    alignItems: 'center', // 자식 요소를 가로로 가운데 정렬
    marginBottom: 20, // 드롭다운과 버튼 간격
    zIndex: 1000,
  },
  dropdown: {
    width: '100%', // 부모 컨테이너 너비에 맞춤
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownList: {
    width: '100%', // 드롭다운 리스트도 부모 너비에 맞춤
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 80, // 화면의 하단에 배치
    width: '90%',
    paddingHorizontal: 10,
  },
  button: {
    width: '45%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray', 
  },
  nextButton: {
    backgroundColor: 'deepskyblue', 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'gray',
    fontSize: 16,
  },
});