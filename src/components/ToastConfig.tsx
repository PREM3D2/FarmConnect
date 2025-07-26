import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={[styles.base, { borderLeftColor: '#4CAF50' }]}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.title}
      text2Style={styles.message}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={[styles.base, { borderLeftColor: '#F44336' }]}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.title}
      text2Style={styles.message}
    />
  ),
  warning: ({ text1, text2, ...rest }: any) => (
    <View style={[styles.base, { borderLeftColor: '#FF9800' }]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  base: {
    height: 70,
    borderLeftWidth: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#555',
  },
});

export default toastConfig;
