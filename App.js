import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SignUpProvider } from './SignUpContext';

import LoginScreen from './screens/LoginScreen';
import FindPasswordScreen from './screens/FindPasswordScreen';
import SetPassWordScreen from './screens/SetPassWordScreen';
import RegisterScreen from './screens/RegisterScreen';
import SelectListScreen from './screens/SelectListScreen';
import LastRegisterScreen from './screens/LastRegisterScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import AddPostScreen from './screens/AddPostScreen';
import BottomTabNavigator from './navigation/BottomTabNavigator'; // 하단 네비게이션 연결

const Stack = createStackNavigator();

export default function App() {
  return (
    <SignUpProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* 로그인 및 회원가입 관련 화면 */}
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FindPasswordScreen" component={FindPasswordScreen} />
          <Stack.Screen name="SetPassWordScreen" component={SetPassWordScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="SelectListScreen" component={SelectListScreen} />
          <Stack.Screen name="LastRegisterScreen" component={LastRegisterScreen} />

          {/* 게시물 관련 화면 */}
          <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
          <Stack.Screen name="AddPostScreen" component={AddPostScreen} />

          {/* 하단 네비게이션 포함된 화면 */}
          <Stack.Screen
            name="MainWithTabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }} // 헤더 숨김
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SignUpProvider>
  );
}
