import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CropsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Crops Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CropsScreen;
