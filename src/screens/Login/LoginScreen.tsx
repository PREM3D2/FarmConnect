import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CheckBox from 'react-native-check-box'
import AuthService from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginSchema = Yup.object().shape({
    mobile: Yup.string().required('Email/Mobile Number is required'),
    password: Yup.string().required('Password is required'),
});



type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
};

const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState({ mobile: '', password: '', remember: false });
    // Autofill credentials if Remember Me was checked
    useEffect(() => {
        const loadRemembered = async () => {
            try {
                const saved = await AsyncStorage.getItem('rememberedCredentials');
                if (saved) {
                    setInitialValues(JSON.parse(saved));
                }
            } catch {}
        };
        loadRemembered();
    }, []);
    
    const dispatch = useDispatch();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <LinearGradient colors={['#fefefdff','#8ff7a4ff']} style={styles.container}>
                <View style={styles.innerContainer}>
                    {/* Logo and App Name */}
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/images/FarmConnect_Logo.png')} style={styles.logo} />
                        <Text style={styles.appName}>FARM CONNECT</Text>
                    </View>
                    {/* Login Title and Welcome Text */}
                    <Text style={styles.loginTitle}>Login</Text>
                    <Text style={styles.welcomeText}>Welcome back! Please enter your details</Text>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={LoginSchema}
                        onSubmit={async (values) => {
                            setLoading(true);
                            setApiError(null);
                            try {
                                if (values.remember) {
                                    await AsyncStorage.setItem('rememberedCredentials', JSON.stringify(values));
                                } else {
                                    await AsyncStorage.removeItem('rememberedCredentials');
                                }
                                const result = await AuthService.login(values.mobile, values.password);
                                dispatch(login(result));
                            } catch (error: any) {
                                console.log('catch', error)
                                setApiError(error?.response?.data?.message || 'Login failed. Please try again.');
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                            <>
                                <Text style={styles.inputLabel}>Email/Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Email/Mobile Number"
                                    // keyboardType="phone-pad"
                                    onChangeText={handleChange('mobile')}
                                    onBlur={handleBlur('mobile')}
                                    value={values.mobile}
                                />
                                {errors.mobile && touched.mobile && (
                                    <Text style={styles.error}>{errors.mobile}</Text>
                                )}
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Password"
                                    // secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {errors.password && touched.password && (
                                    <Text style={styles.error}>{errors.password}</Text>
                                )}
                                {/* Remember Me and Forgot Password Row */}
                                <View style={styles.row}>
                                    <CheckBox
                                        style={{ padding: 2, flex: 1 }}
                                        onClick={() => setFieldValue('remember', !values.remember)}
                                        isChecked={values.remember}
                                        checkBoxColor="#388e3c"
                                        rightText={"Remember me"}
                                    />
                                    <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPassword')}>
                                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* Login Button */}
                                <TouchableOpacity style={styles.loginButton} onPress={() => handleSubmit()} disabled={loading}>
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>Login</Text>
                                    )}
                                </TouchableOpacity>
                                {apiError && (
                                    <Text style={{ color: 'red', marginBottom: 8 }}>{apiError}</Text>
                                )}
                                {/* Or sign in with */}
                                <Text style={styles.orText}>or sign in with</Text>
                                <View style={styles.socialRow}>
                                    <TouchableOpacity>
                                        <Image source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} style={styles.socialIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={{ uri: 'https://img.icons8.com/color/48/000000/facebook-new.png' }} style={styles.socialIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={{ uri: 'https://img.icons8.com/color/48/000000/instagram-new.png' }} style={styles.socialIcon} />
                                    </TouchableOpacity>
                                </View>
                                {/* Sign Up Link */}
                                <View style={styles.signupRow}>
                                    <Text style={styles.signupText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                        <Text style={styles.signupLink}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
    },
    innerContainer: {
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
    loginTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    welcomeText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#388e3c',
        fontWeight: 'bold',
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#388e3c',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        marginVertical: 8,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    socialIcon: {
        width: 40,
        height: 40,
        marginHorizontal: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#c8e6c9',
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    signupText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    signupLink: {
        fontSize: 14,
        color: '#388e3c',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
});

export default LoginScreen;
