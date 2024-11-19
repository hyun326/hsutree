import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// 전역 상태를 사용하기 위해 useSignUp 가져오기
import { useSignUp } from '../SignUpContext';

export default function RegisterScreen({ navigation }) {
  // 전역 상태와 상태 변경 함수를 가져옵니다.
  const { signUpData, setSignUpData } = useSignUp();

  // "다음" 버튼 클릭 시 학번과 이름을 전역 상태에 저장한 후 다음 화면으로 이동
  const handleNext = () => {
    navigation.navigate('SelectListScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>학번</Text>
      {/* 학번 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="학번을 입력하세요"
        value={signUpData.studentId}
        onChangeText={(value) => setSignUpData({ ...signUpData, studentId: value })}
      />
      <Text style={styles.label}>이름</Text>
      {/* 이름 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        value={signUpData.name}
        onChangeText={(value) => setSignUpData({ ...signUpData, name: value })}
      />
      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>다음</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    width: '80%',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
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
