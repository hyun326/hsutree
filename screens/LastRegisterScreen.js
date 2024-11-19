import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Image } from 'expo-image';
// 전역 상태 및 Firestore 가져오기
import { useSignUp } from '../SignUpContext';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function LastRegisterScreen({ navigation }) {
  const { signUpData, setSignUpData } = useSignUp(); // 전역 상태 가져오기

  // Firestore에 데이터 저장
  const handleRegister = async () => {
    // 비밀번호와 비밀번호 확인이 일치하지 않으면 경고 메시지 표시
    if (signUpData.password !== signUpData.passwordConfirm) {
      Alert.alert('오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      // Firestore에 데이터 저장
      await setDoc(doc(db, 'users', signUpData.studentId), signUpData);
      Alert.alert('회원가입 완료', '데이터가 성공적으로 저장되었습니다.');
      navigation.navigate('Login'); // 로그인 화면으로 이동
    } catch (error) {
      Alert.alert('오류', '데이터 저장 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    // 네비게이션 바 숨김
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 이미지 렌더링 */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')} // 이미지 경로 확인
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>

      <Text style={styles.title}>한성대숲</Text>

      {/* 닉네임 입력 */}
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임을 입력하세요"
        value={signUpData.nickname}
        onChangeText={(value) => setSignUpData({ ...signUpData, nickname: value })}
      />

      {/* 학번 입력 */}
      <Text style={styles.label}>학번</Text>
      <TextInput
        style={styles.input}
        placeholder="학번을 입력하세요"
        value={signUpData.studentId}
        onChangeText={(value) => setSignUpData({ ...signUpData, studentId: value })}
      />

      {/* 비밀번호 입력 */}
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        value={signUpData.password}
        secureTextEntry
        onChangeText={(value) => setSignUpData({ ...signUpData, password: value })}
      />

      {/* 비밀번호 확인 */}
      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 다시 입력하세요"
        value={signUpData.passwordConfirm}
        secureTextEntry
        onChangeText={(value) => setSignUpData({ ...signUpData, passwordConfirm: value })}
      />

      {/* 이메일 입력 */}
      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={signUpData.email}
        onChangeText={(value) => setSignUpData({ ...signUpData, email: value })}
      />

      {/* 가입 버튼 */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // ScrollView의 내용물 크기를 채움
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 50, // 스크롤 여유를 위해 추가
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
  registerButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20, // 추가 여백
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
