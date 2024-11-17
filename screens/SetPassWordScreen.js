import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function SetPassWordScreen ({ navigation }) {
  
    const handleNavigate = () => {
        navigation.navigate('SetPassWordScreen'); // 나중에 비밀번호가 변경되고 데이터베이스에 저장하는 부분 (아직 구현안됨)
      }


  const [number, setNumber] = useState(''); // 새 비밀번호
  const [Renumber, setRenumber] = useState(''); // 비밀번호 확인
  


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

      {/* 학번 입력 필드 */}
      <Text style={styles.label}>새 비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        value={number}
        onChangeText={setNumber}
        keyboardType="ascii-capable"
        autoCapitalize="none"
      />
      <Text style={styles.label}>새 비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 동일하게 입력하세요"
        value={Renumber}
        onChangeText={setRenumber}
        
      />
      
        

      {/* 변경 버튼 */}
      <TouchableOpacity style={styles.changeButton} onPress={handleNavigate}>
        <Text style={styles.buttonText}>변경</Text>
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
  changeButton: {
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
