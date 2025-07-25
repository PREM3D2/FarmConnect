import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface DateControlProps {
  value: string | null;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  name: string;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
  style?: any;
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
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    setFieldValue(name, formatDate(date));
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.input, error && touched ? styles.inputError : null]}
        onPress={() => setPickerVisible(true)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="calendar" size={22} color="#388e3c" style={{ marginRight: 8 }} />
        <Text style={{ color: value ? '#333' : '#888', fontSize: 16 }}>
          {value ? value : placeholder}
          {required ? ' *' : ''}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
      />
      {error && touched && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  error: {
    color: '#d32f2f',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default DateControl;
