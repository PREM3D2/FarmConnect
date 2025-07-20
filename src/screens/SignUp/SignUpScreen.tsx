import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SignUpScreen = ({ navigation }: any) => {
  return (
    <LinearGradient colors={['#fefefdff','#8ff7a4ff']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/images/FarmConnect_Logo.png')} style={styles.logo} />
        <Text style={styles.appName}>FARM CONNECT</Text>
      </View>
      <Text style={styles.header}>Register as new User</Text>
      <Text style={styles.inputLabel}>Mobile Number</Text>
      <TextInput style={styles.input} placeholder="Enter Mobile Number" keyboardType="phone-pad" />
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput style={styles.input} placeholder="Enter Email" keyboardType="email-address" />
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput style={styles.input} placeholder="Enter Password" secureTextEntry />
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry />
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>Go to </Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.link}>Login Page</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#c8e6c9',
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#388e3c',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#388e3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#333',
  },
  link: {
    fontSize: 14,
    color: '#388e3c',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
