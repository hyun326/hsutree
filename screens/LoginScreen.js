import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { db } from '../firebaseConfig'; // Firebase 설정 파일 가져오기
import { doc, getDoc } from 'firebase/firestore'; // Firestore에서 데이터 가져오기

// 이미지에 사용할 blurhash
const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function LoginScreen({ navigation }) {
  const [studentId, setStudentId] = useState(''); // 학번 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리

  // 헤더 숨기기
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      const userRef = doc(db, "users", studentId); // 학번을 문서 ID로 사용
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // 비밀번호 비교
        if (userData.password === password) {
          console.log('로그인 성공:', userData);
          navigation.navigate('MainWithTabs'); // MainWithTabs로 이동
        } else {
          Alert.alert('로그인 실패', '비밀번호가 일치하지 않습니다.');
        }
      } else {
        Alert.alert('로그인 실패', '등록된 학번이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('로그인 실패', '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 비밀번호 찾기 화면으로 이동
  const handleNavigate = () => {
    navigation.navigate('FindPasswordScreen');
  };

  // 회원가입 화면으로 이동
  const RegisterNavigate = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <View style={styles.container}>
      {/* 로고 이미지 */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>
      
      {/* 앱 제목 */}
      <Text style={styles.title}>한성대숲</Text>

      {/* 학번 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="학번"
        value={studentId}
        onChangeText={setStudentId}
        keyboardType="numeric"
        autoCapitalize="none"
      />

      {/* 비밀번호 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* 비밀번호 찾기 링크 */}
      <View style={{ width: '90%', alignItems: 'flex-start', paddingHorizontal: '10%' }}> 
        <Text style={styles.linkText} onPress={handleNavigate}>
          Forgot Password?
        </Text>
      </View>
     
      {/* 회원가입 버튼 */}
      <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: '10%' }}>
        <TouchableOpacity style={[styles.registerButton, { width: '40%' }]} onPress={RegisterNavigate}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
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
    fontWeight: '500',
    marginBottom: 30,
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
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerButton: {
    width: '40%',
    height: 40,
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
