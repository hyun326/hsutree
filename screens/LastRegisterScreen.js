import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function FindPasswordScreen({ navigation }) { 
  
  const handleNavigate = () => {
    navigation.navigate('SetPassWordScreen');
  }


  const [nickname, setNickname] = useState(''); // 닉네임
  const [number, setNumber] = useState(''); // 학번
  const [password, setPassword] = useState(''); // 비밀번호
  const [passwordCheck, setPasswordCheck] = useState(''); // 비밀번호 확인
  const [email, setEmail] = useState(''); // 이메일


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

      {/* 닉네임 입력 필드 */}
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname}
        keyboardType="numeric"
        autoCapitalize="none"
      />


      {/* 학번 입력 필드 */}
      <Text style={styles.label}>학번</Text>
      <TextInput
        style={styles.input}
        placeholder="학번을 입력하세요"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하시오"
        value={password}
        onChangeText={setPassword}
        
      />
      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput style={styles.input}
      placeholder="비밀번호를 입력하세요"
      value={passwordCheck}
      onChangeText={setPasswordCheck}
      />

      <Text style={styles.label}>이메일</Text>
      <TextInput style={styles.input}
      placeholder="이메일을 입력하세요"
      value={email}
      onChangeText={setEmail}
      />
        
      

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.RegisterButton} onPress={handleNavigate}>
        <Text style={styles.buttonText}>가입</Text>
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
    paddingTop: 50,
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
  RegisterButton: {
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
