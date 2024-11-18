import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import FindPasswordScreen from './screens/FindPasswordScreen';
import SetPassWordScreen from './screens/SetPassWordScreen';
import RegisterScreen from './screens/RegisterScreen';
import SelectListScreen from './screens/SelectListScreen';
import LastRegisterScreen from './screens/LastRegisterScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="FindPasswordScreen" component={FindPasswordScreen} />
        <Stack.Screen name="SetPassWordScreen" component={SetPassWordScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name ="SelectListScreen" component={SelectListScreen} />
        <Stack.Screen name ="LastRegisterScreen" component={LastRegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );  
}
