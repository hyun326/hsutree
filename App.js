import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import FindPasswordScreen from './screens/FindPasswordScreen';
import SetPassWordScreen from './screens/SetPassWordScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="FindPasswordScreen" component={FindPasswordScreen} />
        <Stack.Screen name="SetPassWordScreen" component={SetPassWordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );  
}
