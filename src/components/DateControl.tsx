import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface DateControlProps {
  value: string | null;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  name: string;
  error?: any;
  touched?: any;
  placeholder?: string;
  required?: boolean;
  style?: any;
  minDate?: Date; // ✅ Minimum allowed date
  maxDate?: Date; // ✅ Maximum allowed date
}

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const DateControl: React.FC<DateControlProps> = ({
  value,
  setFieldValue,
  name,
  error,
  touched,
  placeholder = 'Select Date',
  required = false,
  style,
  minDate,
  maxDate
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -10],
    }),
    left: 14,
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: error && touched ? '#d32f2f' : isFocused ? '#388e3c' : '#888',
    backgroundColor: '#fff',
    paddingHorizontal: 2,
    zIndex: 2,
  };

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    setFieldValue(name, formatDate(date));
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={labelStyle}>
        {placeholder}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Animated.Text>
      <TouchableOpacity
        style={[styles.input, error && touched && styles.inputError]}
        onPress={() => {
          setPickerVisible(true);
          setIsFocused(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.dateText, { color: value ? '#333' : '#888' }]}>
          {value}
        </Text>
        <MaterialCommunityIcons
          name="calendar"
          size={22}
          color="#388e3c"
          style={styles.icon}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        minimumDate={minDate}   // ✅ Added
        maximumDate={maxDate}   // ✅ Added
        onConfirm={(date) => {
          handleConfirm(date);
          setIsFocused(false);
        }}
        onCancel={() => {
          setPickerVisible(false);
          setIsFocused(false);
        }}
      />

      {error && touched && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    flex:1
  },
  asterisk: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Push icon to right
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingTop: 16, // space for floating label
    paddingBottom: 10,
    height: 48,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  dateText: {
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
  },
  error: {
    color: '#d32f2f',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
});

export default DateControl;