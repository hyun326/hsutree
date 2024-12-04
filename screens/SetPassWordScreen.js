import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
// Firestore 가져오기
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
// 전역 상태 가져오기
import { useSignUp } from '../SignUpContext';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function SetPassWordScreen({ navigation, route  }) {
  const { studentId } = route.params; // 전달받은 학번
  console.log('Received Student ID in SetPassWordScreen:', studentId);
  console.log('Received Student ID:', studentId); // 디버깅용
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 네비게이션 바 숨기기
  }, [navigation]);

  const handleSavePassword = async () => {
    // 빈칸 확인
    if (!password.trim() || !passwordConfirm.trim()) {
     Alert.alert('오류', '비밀번호를 입력해주세요.');
      return;
    }

      // 비밀번호 유효성 검사 (영문, 숫자 포함, 최소 8자 이상)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert('오류', '비밀번호는 영문과 숫자를 포함하며 최소 8자 이상이어야 합니다.');
      return;
   }
    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const { studentId } = route.params;
      const userRef = doc(db, 'users', studentId);
      console.log('Updating Firestore Document Path:', userRef.path);
      console.log('Updating Document at:', userRef.path); // Firestore 문서 경로 출력
      await updateDoc(userRef, { password }); // Firestore에 비밀번호 업데이트
      Alert.alert('완료', '비밀번호가 성공적으로 변경되었습니다.');
      navigation.navigate('Login'); // 로그인 화면으로 이동
    } catch (error) {
      Alert.alert('오류', '비밀번호 변경 중 문제가 발생했습니다.');
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

      <Text style={styles.label}>새 비밀번호 (영문, 숫자 포함 8자 이상)</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.label}>새 비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 동일하게 입력하세요"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />

      <TouchableOpacity style={styles.changeButton} onPress={handleSavePassword}>
        <Text style={styles.buttonText}>변경</Text>
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
  changeButton: {
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
