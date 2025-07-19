import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import SignUpScreen from '../screens/SignUp/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

type AuthStackProps = {
  setIsLoggedIn: (loggedIn: boolean) => void;
};

const AuthStack = ({ setIsLoggedIn }: AuthStackProps) => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

export default AuthStack;