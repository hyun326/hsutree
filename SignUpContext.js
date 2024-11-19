//모든 화면에서 공유할 수 있도록 SignUpContext.js 파일을 생성하고 데이터를 관리하는 Context를 정의하는 파일.
import React, { createContext, useContext, useState } from 'react';

// Context 생성
// 이 Context는 전역 상태 관리에 사용됩니다.
const SignUpContext = createContext();

// Context Provider 컴포넌트
// 모든 하위 컴포넌트에서 `signUpData`와 `setSignUpData`를 사용할 수 있습니다.
export const SignUpProvider = ({ children }) => {
  const [signUpData, setSignUpData] = useState({
    studentId: '', // 학번
    name: '', // 이름
    department: '', // 학과
    nickname: '', // 닉네임
    password: '', // 비밀번호
    email: '', // 이메일
  });

  return (
    <SignUpContext.Provider value={{ signUpData, setSignUpData }}>
      {children}
    </SignUpContext.Provider>
  );
};

// 전역 상태를 가져오는 커스텀 훅
// 컴포넌트에서 쉽게 상태를 사용할 수 있도록 제공합니다.
export const useSignUp = () => useContext(SignUpContext);

