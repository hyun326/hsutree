import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// SignUpProvider를 가져옵니다.
import { SignUpProvider } from './SignUpContext';
import LoginScreen from './screens/LoginScreen';
import FindPasswordScreen from './screens/FindPasswordScreen';
import SetPassWordScreen from './screens/SetPassWordScreen';
import RegisterScreen from './screens/RegisterScreen';
import SelectListScreen from './screens/SelectListScreen';
import LastRegisterScreen from './screens/LastRegisterScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import AddPostScreen from './screens/AddPostScreen';
import PostListScreen from './screens/PostListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    // SignUpProvider로 앱 전체를 감싸 전역 상태 관리 활성화
    <SignUpProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="FindPasswordScreen" component={FindPasswordScreen} />
          <Stack.Screen name="SetPassWordScreen" component={SetPassWordScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="SelectListScreen" component={SelectListScreen} />
          <Stack.Screen name="LastRegisterScreen" component={LastRegisterScreen} />
          <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
          <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
          <Stack.Screen name="PostListScreen" component={PostListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SignUpProvider>
  );
}