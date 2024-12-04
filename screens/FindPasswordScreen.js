import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { doc, getDoc } from 'firebase/firestore'; // Firestore 메서드 추가
import { db } from '../firebaseConfig'; // Firestore 초기화 가져오기

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function FindPasswordScreen({ navigation }) {
  const [number, setNumber] = useState(''); // 학번
  const [email, setEmail] = useState(''); // 이메일
  const [name, setName] = useState(''); // 이름

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 네비게이션 바 숨기기
  }, [navigation]);

  const handleNavigate = async () => {
    // 빈 입력 값 확인
    if (!number.trim() || !email.trim() || !name.trim()) {
      Alert.alert('오류', '모든 정보를 입력해주세요.');
      return;
    }

    try {
      // Firestore에서 학번으로 문서 가져오기
      const studentRef = doc(db, 'users', number.trim()); // 'users' 컬렉션에서 학번을 키로 사용
      const studentDoc = await getDoc(studentRef);

      if (!studentDoc.exists()) {
        // 학번이 존재하지 않으면 경고
        Alert.alert('오류', '입력하신 학번에 해당하는 정보가 없습니다.');
        return;
      }

      // Firestore에서 가져온 데이터와 입력 데이터 비교
      const trimmedNumber = number.trim(); // 학번의 공백 제거
      const studentData = studentDoc.data();
      const trimmedEmail = email.trim().toLowerCase(); // 이메일 소문자로 변환
      const trimmedName = name.trim().replace(/\s+/g, ''); // 입력된 이름의 모든 공백 제거
      const storedName = studentData.name.replace(/\s+/g, ''); // Firestore에서 가져온 이름의 모든 공백 제거

      if (
        studentData.email.toLowerCase() === trimmedEmail && // 이메일 대소문자 무시
        storedName === trimmedName // 이름 공백 제거 후 비교
      ) {
        console.log('Navigating to SetPassWordScreen with Student ID:', number.trim()); //디버깅
        navigation.navigate('SetPassWordScreen', { studentId: number.trim() }); // 비밀번호 변경 화면으로 이동
      } else {
        Alert.alert('오류', '입력하신 정보가 일치하지 않습니다. 다시 확인해주세요.');
      }
    } catch (error) {
      console.error('Firestore 정보 확인 오류:', error);
      Alert.alert('오류', '정보 확인 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')} // 로고 이미지
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>

      <Text style={styles.title}>한성대숲</Text>

      <Text style={styles.label}>학번</Text>
      <TextInput
        style={styles.input}
        placeholder="학번을 입력하세요"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
        autoCapitalize="none"
      />

      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>이름 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleNavigate}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 30,
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
  confirmButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
