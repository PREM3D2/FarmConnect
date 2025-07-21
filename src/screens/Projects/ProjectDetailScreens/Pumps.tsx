import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Pumps = () => {
  return (
    <View style={styles.scene}>
      <Text>Pumps Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default Pumps;
