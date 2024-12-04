import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import DropDownPicker from 'react-native-dropdown-picker';
// 전역 상태 가져오기
import { useSignUp } from '../SignUpContext';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function SelectListScreen({ navigation }) {
  const { signUpData, setSignUpData } = useSignUp(); // 전역 상태 가져오기
  const [selected, setSelected] = useState(signUpData.department || null); // 초기값 전역 상태에서 가져옴
  const [open, setOpen] = useState(false); // 드롭다운 열림/닫힘 상태 관리

  const data = [
        // IT공과대학
        { label: '컴퓨터공학부', value: '컴퓨터공학부' },
        { label: '모바일소프트웨어트랙', value: '모바일소프트웨어트랙' },
        { label: '웹공학트랙', value: '웹공학트랙' },
        { label: '빅데이터트랙', value: '빅데이터트랙' },
        { label: '인터넷응용트랙', value: '인터넷응용트랙' },
        { label: '디지털컨텐츠·가상실트랙', value: '디지털컨텐츠·가상실트랙' },
        { label: '기계전자공학부', value: '기계전자공학부' },
        { label: '전기트랙', value: '전기트랙' },
        { label: '시스템반도체트랙', value: '시스템반도체트랙' },
        { label: '기계시스템트랙', value: '기계시스템트랙' },
        { label: '기계자동화트랙', value: '기계자동화트랙' },
        { label: '산업시스템공학부', value: '산업시스템공학부' },
        { label: '산업공학트랙', value: '산업공학트랙' },
        { label: '지능형제조시스템트랙', value: '지능형제조시스템트랙' },
        
    // 창의융합대학
    { label: '상상력인재학부', value: '상상력인재학부' },
    { label: '문화융합콘텐츠학과', value: '문화융합콘텐츠학과' },
    { label: 'AI응용학과', value: 'AI응용학과' },
    { label: '융합보안학과', value: '융합보안학과' },
    { label: '미래모빌리티학과 (신설)', value: '미래모빌리티학과' },
  
    // 디자인대학
    { label: '글로벌패션산업학부', value: '글로벌패션산업학부' },
    { label: '패션디자인트랙', value: '패션디자인트랙' },
    { label: '패션크레이티브디렉션트랙', value: '패션크레이티브디렉션트랙' },
    { label: 'ICT디자인학부', value: 'ICT디자인학부' },
    { label: '뉴미디어 광고·커뮤니케이션디자인트랙', value: '뉴미디어 광고·커뮤니케이션디자인트랙' },
    { label: '브랜드·패키지디자인트랙', value: '브랜드·패키지디자인트랙' },
    { label: '영상·애니메이션디자인트랙', value: '영상·애니메이션디자인트랙' },
    { label: 'UX/UI디자인트랙', value: 'UX/UI디자인트랙' },
    { label: '게임그래픽디자인트랙', value: '게임그래픽디자인트랙' },
    { label: '인테리어디자인트랙', value: '인테리어디자인트랙' },
    { label: 'VMD·전시디자인트랙', value: 'VMD·전시디자인트랙' },
    { label: '뷰티디자인매니지먼트학과', value: '뷰티디자인매니지먼트학과' },
  
    // 미래융합사회과학대학
    { label: '사회과학부', value: '사회과학부' },
    { label: '국제무역트랙', value: '국제무역트랙' },
    { label: '글로벌비즈니스트랙', value: '글로벌비즈니스트랙' },
    { label: '기업·경제분석트랙', value: '기업·경제분석트랙' },
    { label: '경제금융투자트랙', value: '경제금융투자트랙' },    
    { label: '공공행정트랙', value: '공공행정트랙' },
    { label: '법&정책트랙', value: '법&정책트랙' },
    { label: '부동산트랙', value: '부동산트랙' },
    { label: '스마트도시·교통계획트랙', value: '스마트도시·교통계획트랙' },
    { label: '벤처경영트랙', value: '벤처경영트랙' },
    { label: '회계·재무경영트랙', value: '회계·재무경영트랙' },
  
  // 크리에이티브인문예술대학
  { label: '영미문학콘텐츠트랙', value: '영미문학콘텐츠트랙' },
  { label: '영미언어정보트랙', value: '영미언어정보트랙' },
  { label: '한국어교육트랙', value: '한국어교육트랙' },
  { label: '역사문화큐레이션트랙', value: '역사문화큐레이션트랙' },
  { label: '역사콘텐츠트랙', value: '역사콘텐츠트랙' },
  { label: '지식정보문화트랙', value: '지식정보문화트랙' },
  { label: '디지털인문정보학트랙', value: '디지털인문정보학트랙' },
  { label: '예술학부', value: '예술학부' },
  { label: '동양화전공', value: '동양화전공' },
  { label: '서양화전공', value: '서양화전공' },
  { label: '한국무용전공', value: '한국무용전공' },
  { label: '현대무용전공', value: '현대무용전공' },
  { label: '발레전공', value: '발레전공' },

  // 미래플러스대학
  { label: '호텔외식경영학과', value: '호텔외식경영학과' },
  { label: '융합행정학과', value: '융합행정학과' },
  { label: '비즈니스컨설팅학과', value: '비즈니스컨설팅학과' },
  { label: '뷰티디자인학과', value: '뷰티디자인학과' },
  { label: 'ICT융합디자인학과', value: 'ICT융합디자인학과' },
  { label: '미래인재학부', value: '미래인재학부' },

  // 상상력교양대학
  { label: '기초교양학부', value: '기초교양학부' },
  { label: '소양·핵심교양학부', value: '소양·핵심교양학부' },
  { label: '자율교양학부', value: '자율교양학부' },
  ];

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // 상단 네비게이션 바 숨기기
  }, [navigation]);

  const handleNext = () => {
    // 학과 선택 여부 확인
  if (!selected) {
    Alert.alert('오류', '학과를 선택해주세요.');
    return;
  }
    setSignUpData({ ...signUpData, department: selected }); // 선택한 학과 정보를 전역 상태에 저장
    navigation.navigate('LastRegisterScreen'); // 다음 화면으로 이동
  };

  const handleCancel = () => {
    navigation.navigate('RegisterScreen'); // 이전 화면으로 이동
  };

  return (
    <View style={styles.container}>
      {/* 상단 이미지 */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/logo.png')} // 로고 이미지 경로
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>

      {/* 화면 제목 */}
      <Text style={styles.title}>한성대숲</Text>

      {/* 드롭다운 */}
      <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
      <DropDownPicker
  open={open}
  setOpen={setOpen}
  value={selected}
  setValue={setSelected}
  items={data}
  placeholder="학과 이름을 선택하세요"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownList}
  listMode="SCROLLVIEW" // 스크롤 활성화
  dropDownDirection="BOTTOM"
  maxHeight={200} // 스크롤이 필요하도록 최대 높이 설정
  scrollViewProps={{
    nestedScrollEnabled: true, // 중첩 스크롤 활성화
    showsVerticalScrollIndicator: true, // 스크롤바 표시
    keyboardShouldPersistTaps: 'handled',
  }}
  zIndex={3000}
  zIndexInverse={1000}
/>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        {/* 취소 버튼 */}
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>

        {/* 다음 버튼 */}
        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext}>
          <Text style={styles.buttonText}>다음</Text>
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
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 30,
  },
  dropdownContainer: {
    width: '80%', // 드롭다운 컨테이너 너비 설정
    alignItems: 'center',
    marginBottom: 20, // 드롭다운과 버튼 간격
    zIndex: 1000,
  },
  dropdown: {
    width: '100%', // 드롭다운 너비
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownList: {
    width: '100%', // 드롭다운 리스트 너비
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 가로로 나열
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 80, // 화면 하단에 버튼 배치
    width: '90%',
    paddingHorizontal: 10,
  },
  button: {
    width: '45%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray', // 취소 버튼 색상
  },
  nextButton: {
    backgroundColor: 'deepskyblue', // 다음 버튼 색상
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
