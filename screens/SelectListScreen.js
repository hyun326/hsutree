import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import DropDownPicker from 'react-native-dropdown-picker';
// 전역 상태 가져오기
import { useSignUp } from '../SignUpContext';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function SelectListScreen({ navigation }) {
  const { signUpData, setSignUpData } = useSignUp(); // 전역 상태 가져오기
  const [selected, setSelected] = useState(signUpData.department || null); // 초기값 전역 상태에서 가져옴
  const [open, setOpen] = useState(false); // 드롭다운 열림/닫힘 상태 관리

  const data = [
    { label: '컴퓨터공학부', value: '컴퓨터공학부' },
    { label: 'ICT디자인학부', value: 'ICT디자인학부' },
    { label: 'IT공과대학', value: 'IT공과대학' },
    { label: 'IT융합공학부', value: 'IT융합공학부' },
    { label: '기계전자공학부', value: '기계전자공학부' },
    { label: '스마트 경영공학부', value: '스마트 경영공학부' },
  ];

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 상단 네비게이션 바 숨기기
  }, [navigation]);

  const handleNext = () => {
    setSignUpData({ ...signUpData, department: selected }); // 선택한 학과 정보를 전역 상태에 저장
    navigation.navigate('LastRegisterScreen'); // 다음 화면으로 이동
  };

  const handleCancel = () => {
    navigation.navigate('RegisterScreen'); // 이전 화면으로 이동
  };

  return (
    <View style={styles.container}>
      {/* 상단 이미지 */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')} // 로고 이미지 경로
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>

      {/* 화면 제목 */}
      <Text style={styles.title}>한성대숲</Text>

      {/* 드롭다운 */}
      <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={selected}
          setValue={setSelected}
          items={data}
          placeholder="학과 이름을 선택하세요" // 드롭다운 기본 표시 텍스트
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          zIndex={3000} // 드롭다운 리스트 우선순위
          zIndexInverse={1000} // 리스트 반전 우선순위
          searchable={true} // 검색 기능 활성화
          searchPlaceholder="검색하세요..." // 검색 입력 필드의 플레이스홀더
          listMode="SCROLLVIEW" // 리스트 스크롤 모드
          dropDownDirection="BOTTOM" // 드롭다운 방향 고정 (아래로만 열림)
          maxHeight={200} // 드롭다운 창 최대 높이 설정
          scrollViewProps={{
            nestedScrollEnabled: true, // 스크롤 가능 설정
          }}
        />
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        {/* 취소 버튼 */}
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>

        {/* 다음 버튼 */}
        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext}>
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
    fontWeight: 'bold',
    marginBottom: 30, // 텍스트와 입력 필드 간격
  },
  dropdownContainer: {
    width: '80%', // 드롭다운 컨테이너 너비 설정
    alignItems: 'center',
    marginBottom: 20, // 드롭다운과 버튼 간격
    zIndex: 1000,
  },
  dropdown: {
    width: '100%', // 드롭다운 너비
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownList: {
    width: '100%', // 드롭다운 리스트 너비
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 가로로 나열
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 80, // 화면 하단에 버튼 배치
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
    backgroundColor: 'gray', // 취소 버튼 색상
  },
  nextButton: {
    backgroundColor: 'deepskyblue', // 다음 버튼 색상
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
