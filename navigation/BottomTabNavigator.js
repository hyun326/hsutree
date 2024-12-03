import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import PostListScreen from '../screens/PostListScreen';
import ScheduleScreen from '../screens/ScheduleScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Map') {
            iconName = 'map';
          } else if (route.name === 'PostList') {
            iconName = 'list';
          } else if (route.name === 'Schedule') {
            iconName = 'calendar';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
<Tab.Screen
  name="Map"
  component={MapScreen}
  options={{ headerShown: false }} // 상단 타이틀 숨기기
/>
<Tab.Screen
  name="PostList"
  component={PostListScreen}
  options={{ headerShown: false }} // 상단 타이틀 숨기기
/>
<Tab.Screen
  name="Schedule"
  component={ScheduleScreen}
  options={{ headerShown: false }} // 상단 타이틀 숨기기
/>
    </Tab.Navigator>
  );
}
