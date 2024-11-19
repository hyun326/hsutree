import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
// 전역 상태 가져오기
import { useSignUp } from '../SignUpContext';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function FindPasswordScreen({ navigation }) {
  const { signUpData } = useSignUp(); // 전역 상태 가져오기
  const [number, setNumber] = useState(''); // 학번
  const [email, setEmail] = useState(''); // 이메일
  const [name, setName] = useState(''); // 이름

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 네비게이션 바 숨기기
  }, [navigation]);

  const handleNavigate = () => {
    // 디버깅: 입력 값과 전역 상태 출력
    console.log('입력된 값:', { number, email, name });
    console.log('전역 상태 값:', signUpData);

    // 입력 값과 전역 상태 값을 공백 제거 후 비교
    const trimmedNumber = number.trim();
    const trimmedEmail = email.trim().toLowerCase(); // 이메일 소문자로 변환
    const trimmedName = name.trim().replace(/\s+/g, ''); // 입력된 이름의 모든 공백 제거
    const storedName = signUpData.name.replace(/\s+/g, ''); // 전역 상태 이름의 모든 공백 제거

    if (
      signUpData.studentId === trimmedNumber &&
      signUpData.email.toLowerCase() === trimmedEmail && // 이메일 대소문자 무시
      storedName === trimmedName
    ) {
      navigation.navigate('SetPassWordScreen'); // 비밀번호 변경 화면으로 이동
    } else {
      Alert.alert('오류', '정보가 일치하지 않습니다. 다시 확인해주세요.');
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
    fontSize: 36,
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
