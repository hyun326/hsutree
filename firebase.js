// Firebase Admin SDK 초기화
const admin = require('firebase-admin');

// Firebase 서비스 계정 키 JSON 파일 경로 (Firebase 콘솔에서 다운로드한 파일 경로 입력)
const serviceAccount = require('./hsutree-3a445-firebase-adminsdk-s1v44-5aee2bf658.json'); // 실제 경로로 변경

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // 서비스 계정 인증
  databaseURL: 'https://your-database-name.firebaseio.com', // 실제 Firebase 데이터베이스 URL 입력
});

// Firestore Database 객체 가져오기
const db = admin.firestore();

module.exports = { db };
