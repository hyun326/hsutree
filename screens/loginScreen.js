import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function LoginScreen({ navigation }) {
 
  const handleNavigate = () => {
    navigation.navigate('FindPasswordScreen');
  }

  const RegisterNavigate = () => {
    navigation.navigate('RegisterScreen');
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 헤더 숨기기
  }, [navigation]);


  const handleLogin = () => {
    // 로그인 로직
    console.log('로그인:', email, password); // 로그인 로직도 아직 구현 안됨.
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

      {/* 로그인 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
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
      <View style={{ width: '90%', alignItems: 'flex-start', paddingHorizontal: '10%' }}> 
     <Text style={styles.linkText} onPress={handleNavigate}>
          ForgotPassword?
     </Text>
     </View>
     
     
      {/*회원가입 버튼*/}
      <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: '10%' }}>
  <TouchableOpacity style={[styles.registerButton, { width: '40%' }]} onPress={RegisterNavigate}>
    <Text style={styles.buttonText}>회원가입</Text>
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

  registerButton:{
    width: '20%',
    height: 40,
    backgroundColor: 'deepskyblue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  linkText:{
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
   
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
