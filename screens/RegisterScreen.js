import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
// 전역 상태를 가져오기 위해 useSignUp 추가
import { useSignUp } from '../SignUpContext';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function RegisterScreen({ navigation }) { // 회원가입창 1

  // 전역 상태 관리에서 데이터를 가져옵니다.
  const { signUpData, setSignUpData } = useSignUp();

  // 학번과 이름 입력 변경 처리
  const handleStudentIdChange = (value) => {
    setSignUpData({ ...signUpData, studentId: value });
  };

  const handleNameChange = (value) => {
    setSignUpData({ ...signUpData, name: value });
  };

  // 헤더 숨기기 (초기 로드 시 실행)
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // 다음 화면으로 이동
  const handleNavigate = () => {
    navigation.navigate('SelectListScreen'); // 회원가입 다음 창으로 넘어가는 로직
  };

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

      {/* 학번 입력 필드 */}
      <Text style={styles.label}>학번</Text>
      <TextInput
        style={styles.input}
        placeholder="학번을 입력하세요"
        value={signUpData.studentId} // 전역 상태에서 학번 가져오기
        onChangeText={handleStudentIdChange} // 학번 변경 시 전역 상태 업데이트
        keyboardType="numeric"
        autoCapitalize="none"
      />
      
      {/* 이름 입력 필드 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        value={signUpData.name} // 전역 상태에서 이름 가져오기
        onChangeText={handleNameChange} // 이름 변경 시 전역 상태 업데이트
      />

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.NextButton} onPress={handleNavigate}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
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
  label: {
    width: '80%',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  NextButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
