import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, TextStyle } from 'react-native';

import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
interface AppTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: () => void;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
  style?: any;
  error?: string;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  required = false,
  maxLength,
  keyboardType = 'default',
  style,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    console.log(error ? 'Error state' : 'Normal state', { isFocused, value, error });
  }, [isFocused, value]);

  const labelStyle: Animated.AnimatedProps<TextStyle> = {
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -10],
    }),
    left: 14,
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: error ? '#d32f2f' : isFocused ? '#388e3c' : '#888',
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    position: 'absolute' as 'absolute',
    zIndex: 2,
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={labelStyle}>
        {placeholder}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Animated.Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          onFocus && onFocus();
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        maxLength={maxLength}
        keyboardType={keyboardType}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  asterisk: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  error: {
    color: '#d32f2f',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
});

export default AppTextInput;
