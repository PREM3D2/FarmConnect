import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface AppDropdownProps {
  data: any[];
  value: any;
  onChange: (item: any) => void;
  labelField: string;
  valueField: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  style?: any;
  dropdownStyle?: any;
  disabled?: boolean;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  data,
  value,
  onChange,
  labelField,
  valueField,
  placeholder,
  required = false,
  error,
  style,
  dropdownStyle,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    // Always float label to top if value is present (including 0), even if not focused
    const hasValue = value !== undefined && value !== null && value !== '';
    Animated.timing(animatedLabel, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -10], // 16px when not focused, -8px when focused (aligns with top border)
    }),
    left: 14,
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: error ? '#d32f2f' : isFocused ? '#388e3c' : '#888',
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    position: "absolute" as const,
    zIndex: 2,
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={labelStyle}>
        {placeholder}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Animated.Text>
      <Dropdown
        style={[styles.dropdown, error && styles.dropdownError, dropdownStyle]}
        data={data}
        labelField={labelField}
        valueField={valueField}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={item => {
          onChange(item);
          setIsFocused(false);
        }}
        placeholder={''}
        disable={disabled}
        selectedTextStyle={{ fontSize: 16 }} 
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 48,
    // paddingTop: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dropdownError: {
    borderColor: '#d32f2f',
  },
  error: {
    color: '#d32f2f',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
});

export default AppDropdown;
