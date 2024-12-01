const { db } = require('./firebase'); // Firebase 초기화된 파일 import

  const locations = [
    {
        id: 1,
        title: '창의관',
        description: '여기는 창의관입니다.',
        facilities: ['학식당(B1)', '미용실(B1)', '이마트24(B1)','디자인대학(5F)','옥상 정원(6F)'],
        latitude: 37.582138,
        longitude: 127.010805,
      },
      {
        id: 2,
        title: '낙산관',
        description: '여기는 낙산관입니다.',
        facilities: ['체력단련실(4F)', '체육관(3F)','대강당(2F)','기계실(B1)'],
        latitude: 37.582100,
        longitude: 127.011305,
      },
      {
        id: 3,
        title: '미래관',
        description: '여기는 미래관입니다.',
        facilities: ['그라찌에(B1)', '강의실(B1)','창의열람실(3F)','상상커먼스(5F)','집중열람실(4F)','러닝커먼스(3F)','하늘정원(6F)'],
        latitude: 37.582548,
        longitude: 127.010805,
      },
      {
        id: 4,
        title: '우촌관',
        description: '여기는 우촌관입니다.',
        facilities: ['직원 휴게실(7F)', '교수실(4F)','구내서점(1F)','우체국(1F)','학생회실(2F)','홍보팀(6F)'],
        latitude: 37.583038,
        longitude: 127.010605,
      },
      {
        id: 5,
        title: '상상관',
        description: '여기는 상상관입니다.',
        facilities: ['강의실(2F~11F)', '팥고당(2F)','이사장실(9F)','전망대(12F)','케이키친(12F)','학생휴게실(7F)','컴퓨터실습실(4F)','상상베이스(B2)','주차장(B2)'],
        latitude: 37.582648,
        longitude: 127.010105,
      },
      {
        id: 6,
        title: '풋살장',
        description: '여기는 풋살장입니다.',
        facilities: ['테니스장'],
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
        facilities: ['사물함실(2F)','모형실습실(1F)','교육인증센터(3F)','교수학습센터(3F)','크리에이티브인문예술대학(4F)','교양교육연구소(4F)'],
        latitude: 37.583028,
        longitude: 127.009575,
      },
      {
        id: 9,
        title: '탐구관',
        description: '여기는 탐구관입니다.',
        facilities: ['교강사휴게실(4F)','실습실(2F)','조교실(2F)','산학협력 세미나실(B1)','강의실(5,4,3,2,1F,B1)','전기실(B2)'],
        latitude: 37.583448,
        longitude: 127.009135,
      },
      {
        id: 10,
        title: '학군단',
        description: '여기는 학군단입니다.',
        facilities: ['ROTC'],
        latitude: 37.583178,
        longitude: 127.008915,
      },
      {
        id: 11,
        title: '연구관',
        description: '여기는 연구관입니다.',
        facilities: ['상상파크(B2~1F)', '오뜨(1F)','교수연구실(2F~9F)'],
        latitude: 37.582288,
        longitude: 127.009785,
      },
      {
        id: 12,
        title: '지선관',
        description: '여기는 지선관입니다.',
        facilities: ['IT공과대학(1F)', '서양화실기실(4F)','사진스튜디오(2F)','사진실(2F)','동양화실기실(4F)','대학원 진채실기실(4F)','한지조형실습실(4F)'],
        latitude: 37.581998,
        longitude: 127.009785,
      },
      {
        id: 13,
        title: '공학관A',
        description: '여기는 공학관 A입니다.',
        facilities: ['상상파크 플러스(B1)', '강의실(2F~4F)','휴게실(1F)','열유체환경측정실험실(4F)','전산설계실(5F)',],
        latitude: 37.581798,
        longitude: 127.009865,
      },
      {
        id: 14,
        title: '공학관B',
        description: '여기는 공학관 B입니다.',
        facilities: ['강의실(1F~6F)', '학생회실(B1)','세미나실(2F)','프린터룸(4F)','인공지능실험실(4F)'],
        latitude: 37.581498,
        longitude: 127.009585,
      },
      {
        id: 15,
        title: '상빌',
        description: '여기는 상상빌리지입니다.',
        facilities: ['사생실(1F~7F)', '무인택배실(1F)','행정실(1F)','독서실(B1)','gx룸(B2)','체력단련실(B2)','요가실(B2)','CU(B1)'],
        latitude: 37.581498,
        longitude: 127.010005,
      },
      {
        id: 16,
        title: '인성관',
        description: '여기는 인성관입니다.',
        facilities: ['동아리방(2F~5F)', '동아리연합회(5F)'],
        latitude: 37.581938,
        longitude: 127.010805,
      },
      {
        id: 17,
        title: '학송관',
        description: '여기는 학송관입니다.',
        facilities: ['평생교육원', '콘텐츠디자인칼리지'],
        latitude: 37.583298,
        longitude: 127.009575,
      },
  ];
  // Firestore에 데이터 업로드
async function uploadData() {
  try {
    const batch = db.batch(); // Batch 쓰기를 사용하여 여러 문서를 한 번에 작성
    locations.forEach((location) => {
      const docRef = db.collection('locations').doc(`${location.id}`); // 각 데이터에 대해 고유 ID를 문서 ID로 설정
      batch.set(docRef, location); // 데이터를 설정
    });
    await batch.commit(); // Batch 쓰기 커밋
    console.log('데이터 업로드 완료!');
  } catch (error) {
    console.error('데이터 업로드 중 오류 발생:', error);
  }
}

// 업로드 함수 실행
uploadData();