const { db } = require('./firebaseConfig'); // Firestore 초기화된 인스턴스 가져오기
const { collection, doc, setDoc } = require('firebase/firestore');

const locations = [
  {
    id: 1,
    title: '창의관',
    description: '여기는 창의관입니다.',
    facilities: [
      {
        name: '학식당(B1)',
        imageUrl: 'https://i.imgur.com/QYUo7gq.png', // 학식당 이미지 URL
      },
      {
        name: '미용실(B1)',
      },
      {
        name: '이마트24(B1)',
        imageUrl: 'https://i.imgur.com/YXOkxjD.png',
      },
      {
        name: '디자인대학(B1)',
      },
      {
        name: '옥상 정원(6F)',
      },
    ],
    latitude: 37.582138,
    longitude: 127.010805,
    imageUrl: 'https://i.imgur.com/QssheiZ.png', // 창의관 이미지 URL
  },
  {
    id: 2,
    title: '낙산관',
    description: '여기는 낙산관입니다.',
    facilities: [
      { name: '체력단련실(4F)' },
      { name: '체육관(3F)' },
      { name: '대강당(2F)' },
      { name: '기계실(B1)' },
    ],
    latitude: 37.582100,
    longitude: 127.011305,
  },
  {
    id: 3,
    title: '미래관',
    description: '여기는 미래관입니다.',
    facilities: [
      { name: '그라찌에(B1)' },
      { name: '강의실(B1)' },
      { name: '창의열람실(3F)' },
      { name: '상상커먼스(5F)' },
      { name: '집중열람실(4F)' },
      { name: '러닝커먼스(3F)' },
      { name: '하늘정원(6F)' },
    ],
    latitude: 37.582548,
    longitude: 127.010805,
  },
  {
    id: 4,
    title: '우촌관',
    description: '여기는 우촌관입니다.',
    facilities: [
      { name: '직원 휴게실(7F)' },
      { name: '교수실(4F)' },
      { name: '구내서점(1F)' },
      { name: '우체국(1F)' },
      { name: '학생회실(2F)' },
      { name: '홍보팀(6F)' },
    ],
    latitude: 37.583038,
    longitude: 127.010605,
  },
  {
    id: 5,
    title: '상상관',
    description: '여기는 상상관입니다.',
    facilities: [
      { name: '강의실(2F~11F)' },
      { name: '팥고당(2F)' },
      { name: '이사장실(9F)' },
      { name: '전망대(12F)' },
      { name: '케이키친(12F)' },
      { name: '학생휴게실(7F)' },
      { name: '컴퓨터실습실(4F)' },
      { name: '상상베이스(B2)' },
      { name: '주차장(B2)' },
    ],
    latitude: 37.582648,
    longitude: 127.010105,
  },
  {
    id: 6,
    title: '풋살장',
    description: '여기는 풋살장입니다.',
    facilities: [
      { name: '테니스장' },
    ],
    latitude: 37.582628,
    longitude: 127.009405,
  },
  {
    id: 7,
    title: '잔디광장',
    description: '여기는 잔디광장입니다.',
    facilities: [],
    latitude: 37.582628,
    longitude: 127.009705,
  },
  {
    id: 8,
    title: '진리관',
    description: '여기는 진리관입니다.',
    facilities: [
      { name: '사물함실(2F)' },
      { name: '모형실습실(1F)' },
      { name: '교육인증센터(3F)' },
      { name: '교수학습센터(3F)' },
      { name: '크리에이티브인문예술대학(4F)' },
      { name: '교양교육연구소(4F)' },
    ],
    latitude: 37.583028,
    longitude: 127.009575,
  },
  {
    id: 9,
    title: '탐구관',
    description: '여기는 탐구관입니다.',
    facilities: [
      { name: '교강사휴게실(4F)' },
      { name: '실습실(2F)' },
      { name: '조교실(2F)' },
      { name: '산학협력 세미나실(B1)' },
      { name: '강의실(5,4,3,2,1F,B1)' },
      { name: '전기실(B2)' },
    ],
    latitude: 37.583448,
    longitude: 127.009135,
  },
  {
    id: 10,
    title: '학군단',
    description: '여기는 학군단입니다.',
    facilities: [
      { name: 'ROTC' },
    ],
    latitude: 37.583178,
    longitude: 127.008915,
  },
  {
    id: 11,
    title: '연구관',
    description: '여기는 연구관입니다.',
    facilities: [
      { name: '상상파크(B2~1F)' },
      { name: '오뜨(1F)' },
      { name: '교수연구실(2F~9F)' },
    ],
    latitude: 37.582288,
    longitude: 127.009785,
  },
  {
    id: 12,
    title: '지선관',
    description: '여기는 지선관입니다.',
    facilities: [
      { name: 'IT공과대학(1F)' },
      { name: '서양화실기실(4F)' },
      { name: '사진스튜디오(2F)' },
      { name: '사진실(2F)' },
      { name: '동양화실기실(4F)' },
      { name: '대학원 진채실기실(4F)' },
      { name: '한지조형실습실(4F)' },
    ],
    latitude: 37.581998,
    longitude: 127.009785,
  },
  {
    id: 13,
    title: '공학관A',
    description: '여기는 공학관 A입니다.',
    facilities: [
      { name: '상상파크 플러스(B1)' },
      { name: '강의실(2F~4F)' },
      { name: '휴게실(1F)' },
      { name: '열유체환경측정실험실(4F)' },
      { name: '전산설계실(5F)' },
    ],
    latitude: 37.581798,
    longitude: 127.009865,
  },
  {
    id: 14,
    title: '공학관B',
    description: '여기는 공학관 B입니다.',
    facilities: [
      { name: '강의실(1F~6F)' },
      { name: '학생회실(B1)' },
      { name: '세미나실(2F)' },
      { name: '프린터룸(4F)' },
      { name: '인공지능실험실(4F)' },
    ],
    latitude: 37.581498,
    longitude: 127.009585,
  },
  {
    id: 15,
    title: '상빌',
    description: '여기는 상상빌리지입니다.',
    facilities: [
      { name: '사생실(1F~7F)' },
      { name: '무인택배실(1F)' },
      { name: '행정실(1F)' },
      { name: '독서실(B1)' },
      { name: 'gx룸(B2)' },
      { name: '체력단련실(B2)' },
      { name: '요가실(B2)' },
      { name: 'CU(B1)' },
    ],
    latitude: 37.581498,
    longitude: 127.010005,
  },
  {
    id: 16,
    title: '인성관',
    description: '여기는 인성관입니다.',
    facilities: [
      { name: '동아리방(2F~5F)' },
      { name: '동아리연합회(5F)' },
    ],
    latitude: 37.581938,
    longitude: 127.010805,
  },
  {
    id: 17,
    title: '학송관',
    description: '여기는 학송관입니다.',
    facilities: [
      { name: '평생교육원' },
      { name: '콘텐츠디자인칼리지' },
    ],
    latitude: 37.583298,
    longitude: 127.009575,
  },
];

// Firestore에 데이터 업로드
async function uploadLocations() {
  try {
    for (const location of locations) {
      // Firestore의 "locations" 컬렉션에서 특정 문서 참조 가져오기
      const locationDoc = doc(db, 'locations', location.id.toString());

      // setDoc을 사용하여 특정 문서 ID로 데이터를 저장 (덮어쓰기)
      await setDoc(locationDoc, location);
    }

    console.log('데이터가 성공적으로 Firestore에 업로드되었습니다.');
  } catch (error) {
    console.error('데이터 업로드 중 오류 발생:', error);
  }
}

// 업로드 함수 실행
uploadLocations();
