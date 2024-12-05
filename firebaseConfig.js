// Firebase SDK에서 필요한 기능들을 가져옵니다.
import { initializeApp } from "firebase/app"; // Firebase 앱 초기화 함수
import { getAuth } from "firebase/auth"; // Firebase Authentication (사용자 인증) 기능
import { getFirestore } from "firebase/firestore"; // Firebase Firestore (실시간 데이터베이스) 기능
import { getStorage } from "firebase/storage"; // Firebase Storage (파일 업로드/다운로드) 기능
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 라이브러리

// Firebase 설정 정보 (Firebase 콘솔에서 제공된 설정 값을 입력)
// Firebase 프로젝트에 연결하기 위한 고유 정보입니다.
// 이 정보는 프로젝트 ID, API 키 등을 포함합니다.
const firebaseConfig = {
  apiKey: "AIzaSyBTvwEAIsTOfR50sS5rkVcOv778cV3V7LA", // Firebase 프로젝트의 API 키
  authDomain: "hsutree-3a445.firebaseapp.com", // 인증 도메인
  projectId: "hsutree-3a445", // Firebase 프로젝트 ID
  storageBucket: "hsutree-3a445.firebasestorage.app", // Firebase Storage 버킷 URL
  messagingSenderId: "1060652074607", // 메시징 발신자 ID (FCM 사용 시 필요)
  appId: "1:1060652074607:web:d2e126f4744ea4e54f2f9a" // Firebase 앱의 고유 ID
};

// Firebase 앱 초기화
// 위에서 정의한 firebaseConfig를 기반으로 Firebase 앱을 초기화합니다.
// 초기화된 Firebase 앱은 Firebase의 각 서비스를 사용할 수 있게 합니다.
const app = initializeApp(firebaseConfig);

// Firebase Authentication 초기화
// Firebase 인증 서비스를 사용하려면 getAuth 함수를 통해 인증 객체를 가져옵니다.
// 이 객체를 통해 로그인, 회원가입, 비밀번호 재설정 등의 작업을 할 수 있습니다.
const auth = getAuth(app);

// Firestore Database 초기화
// Firestore는 Firebase의 NoSQL 데이터베이스로, 데이터를 실시간으로 저장 및 읽을 수 있습니다.
// 이 객체를 통해 데이터를 추가, 수정, 삭제, 읽기 등의 작업을 수행합니다.
const db = getFirestore(app);

// Firebase Storage 초기화
// Storage는 Firebase의 파일 저장 서비스로, 이미지, 동영상 등 정적 파일을 업로드하거나 다운로드할 때 사용됩니다.
// 이 객체를 사용하여 파일을 업로드하거나 다운로드할 수 있습니다.
const storage = getStorage(app);

// 초기화된 Firebase 앱과 각 서비스를 외부에서 사용할 수 있도록 내보냅니다.
// 다른 파일에서 import하여 Firebase 서비스를 쉽게 사용할 수 있습니다.
export { app, auth, db, storage };
